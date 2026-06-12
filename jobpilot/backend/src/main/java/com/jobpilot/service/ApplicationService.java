package com.jobpilot.service;

import com.jobpilot.dto.request.CreateApplicationRequest;
import com.jobpilot.dto.request.UpdateApplicationRequest;
import com.jobpilot.dto.request.UpdateStatusRequest;
import com.jobpilot.dto.response.ApplicationDetailResponse;
import com.jobpilot.dto.response.ApplicationSummaryResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.Resume;
import com.jobpilot.entity.User;
import com.jobpilot.enums.ApplicationStatus;
import com.jobpilot.enums.Priority;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.mapper.ApplicationMapper;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.repository.ResumeRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;
    private final ApplicationMapper applicationMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<ApplicationSummaryResponse> list(ApplicationStatus status, String search) {
        Long userId = currentUserService.getCurrentUserId();
        return applicationRepository.search(userId, status, search).stream()
                .map(applicationMapper::toSummaryResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ApplicationDetailResponse getDetail(Long id) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwned(id, user.getId());
        return applicationMapper.toDetailResponse(application, user);
    }

    @Transactional
    public ApplicationDetailResponse create(CreateApplicationRequest request) {
        User user = currentUserService.getCurrentUser();

        Application application = Application.builder()
                .user(user)
                .companyName(request.companyName())
                .roleTitle(request.roleTitle())
                .jobDescription(request.jobDescription())
                .jobUrl(request.jobUrl())
                .location(request.location())
                .workMode(request.workMode())
                .salaryRange(request.salaryRange())
                .notes(request.notes())
                .priority(request.priority() != null ? request.priority() : Priority.MEDIUM)
                .resume(resolveResume(request.resumeId(), user.getId()))
                .build();

        Application saved = applicationRepository.save(application);
        return applicationMapper.toDetailResponse(saved, user);
    }

    @Transactional
    public ApplicationDetailResponse update(Long id, UpdateApplicationRequest request) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwned(id, user.getId());

        application.setCompanyName(request.companyName());
        application.setRoleTitle(request.roleTitle());
        application.setJobDescription(request.jobDescription());
        application.setJobUrl(request.jobUrl());
        application.setAppliedDate(request.appliedDate());
        application.setSalaryRange(request.salaryRange());
        application.setLocation(request.location());
        application.setWorkMode(request.workMode());
        application.setNotes(request.notes());
        application.setPriority(request.priority() != null ? request.priority() : application.getPriority());
        application.setResume(resolveResume(request.resumeId(), user.getId()));

        return applicationMapper.toDetailResponse(application, user);
    }

    @Transactional
    public ApplicationDetailResponse updateStatus(Long id, UpdateStatusRequest request) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwned(id, user.getId());

        application.setStatus(request.status());
        if (request.status() != ApplicationStatus.BOOKMARKED && application.getAppliedDate() == null) {
            application.setAppliedDate(LocalDate.now());
        }

        return applicationMapper.toDetailResponse(application, user);
    }

    @Transactional
    public void delete(Long id) {
        Long userId = currentUserService.getCurrentUserId();
        Application application = findOwned(id, userId);
        applicationRepository.delete(application);
    }

    private Application findOwned(Long id, Long userId) {
        return applicationRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }

    private Resume resolveResume(Long resumeId, Long userId) {
        if (resumeId == null) {
            return null;
        }
        return resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));
    }
}
