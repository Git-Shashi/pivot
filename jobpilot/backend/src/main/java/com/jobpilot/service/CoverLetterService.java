package com.jobpilot.service;

import com.jobpilot.dto.request.GenerateCoverLetterRequest;
import com.jobpilot.dto.request.UpdateCoverLetterRequest;
import com.jobpilot.dto.response.ApplicationDetailResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.Resume;
import com.jobpilot.entity.User;
import com.jobpilot.exception.BadRequestException;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.mapper.ApplicationMapper;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CoverLetterService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CurrentUserService currentUserService;
    private final PdfTextExtractionService pdfTextExtractionService;
    private final GeminiService geminiService;

    @Transactional
    public ApplicationDetailResponse generate(Long id, GenerateCoverLetterRequest request) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwned(id, user.getId());

        Resume resume = application.getResume() != null ? application.getResume() : user.getDefaultResume();
        if (resume == null) {
            throw new BadRequestException("No resume available. Upload a resume or set a default resume first.");
        }

        String resumeText = pdfTextExtractionService.extractText(resume.getFileUrl());
        String tone = (request != null && request.tone() != null && !request.tone().isBlank())
                ? request.tone() : "professional";

        String prompt = buildPrompt(application, resumeText, tone);
        String coverLetter = geminiService.generateContent(prompt);

        application.setCoverLetter(coverLetter.trim());

        return applicationMapper.toDetailResponse(application, user);
    }

    @Transactional
    public ApplicationDetailResponse update(Long id, UpdateCoverLetterRequest request) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwned(id, user.getId());

        application.setCoverLetter(request.coverLetter());

        return applicationMapper.toDetailResponse(application, user);
    }

    private String buildPrompt(Application application, String resumeText, String tone) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Write a ").append(tone).append(" cover letter for the following job application.\n\n");
        prompt.append("Company: ").append(application.getCompanyName()).append("\n");
        prompt.append("Role: ").append(application.getRoleTitle()).append("\n");

        if (application.getJobDescription() != null && !application.getJobDescription().isBlank()) {
            prompt.append("Job Description:\n").append(application.getJobDescription()).append("\n\n");
        }

        prompt.append("Candidate's Resume:\n").append(resumeText).append("\n\n");
        prompt.append("Write a concise, tailored cover letter (3-4 paragraphs) that highlights the candidate's ")
                .append("relevant experience and skills for this role. Do not include placeholder text like ")
                .append("'[Your Name]' or '[Date]' - write the body of the letter only.");

        return prompt.toString();
    }

    private Application findOwned(Long id, Long userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }
}
