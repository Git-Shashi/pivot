package com.jobpilot.dto.response;

import com.jobpilot.enums.ApplicationStatus;
import com.jobpilot.enums.Priority;
import com.jobpilot.enums.WorkMode;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record ApplicationDetailResponse(
        Long id,
        String companyName,
        String roleTitle,
        String jobDescription,
        String jobUrl,
        ApplicationStatus status,
        Priority priority,
        String location,
        WorkMode workMode,
        String salaryRange,
        String notes,
        String coverLetter,
        LocalDate appliedDate,
        ApplicationResumeInfo resumeInfo,
        List<RoundResponse> rounds,
        List<ContactResponse> contacts,
        List<TodoResponse> todos,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
