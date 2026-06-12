package com.jobpilot.service;

import com.jobpilot.dto.response.ResumeResponse;
import com.jobpilot.entity.Resume;
import com.jobpilot.entity.User;
import com.jobpilot.exception.BadRequestException;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.repository.ResumeRepository;
import com.jobpilot.repository.UserRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<ResumeResponse> list() {
        Long userId = currentUserService.getCurrentUserId();
        return resumeRepository.findByUserId(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ResumeResponse upload(MultipartFile file, String label) {
        validateFile(file);

        User user = currentUserService.getCurrentUser();

        Map<?, ?> uploadResult = cloudinaryService.upload(file, "jobpilot/resumes/" + user.getId());

        boolean isFirstResume = resumeRepository.findByUserId(user.getId()).isEmpty();

        Resume resume = Resume.builder()
                .user(user)
                .label(label)
                .fileUrl((String) uploadResult.get("secure_url"))
                .cloudinaryPublicId((String) uploadResult.get("public_id"))
                .fileName(file.getOriginalFilename())
                .isDefault(isFirstResume)
                .build();

        Resume saved = resumeRepository.save(resume);

        if (isFirstResume) {
            user.setDefaultResume(saved);
            userRepository.save(user);
        }

        return toResponse(saved);
    }

    @Transactional
    public ResumeResponse setDefault(Long id) {
        User user = currentUserService.getCurrentUser();
        Resume resume = findOwned(id, user.getId());

        resumeRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(previous -> {
                    if (!previous.getId().equals(resume.getId())) {
                        previous.setDefault(false);
                    }
                });

        resume.setDefault(true);
        user.setDefaultResume(resume);
        userRepository.save(user);

        return toResponse(resume);
    }

    @Transactional
    public void delete(Long id) {
        User user = currentUserService.getCurrentUser();
        Resume resume = findOwned(id, user.getId());

        if (user.getDefaultResume() != null && user.getDefaultResume().getId().equals(resume.getId())) {
            user.setDefaultResume(null);
            userRepository.save(user);
        }

        cloudinaryService.delete(resume.getCloudinaryPublicId());
        resumeRepository.delete(resume);
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("File is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size must not exceed 5MB");
        }
        String contentType = file.getContentType();
        String filename = file.getOriginalFilename();
        boolean isPdf = "application/pdf".equals(contentType)
                || (filename != null && filename.toLowerCase().endsWith(".pdf"));
        if (!isPdf) {
            throw new BadRequestException("Only PDF files are allowed");
        }
    }

    private Resume findOwned(Long id, Long userId) {
        return resumeRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }

    private ResumeResponse toResponse(Resume resume) {
        return new ResumeResponse(
                resume.getId(),
                resume.getLabel(),
                resume.getFileName(),
                resume.getFileUrl(),
                resume.isDefault(),
                resume.getCreatedAt()
        );
    }
}
