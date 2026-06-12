package com.jobpilot.dto.response;

import com.jobpilot.enums.ApplicationStatus;
import com.jobpilot.enums.Priority;
import com.jobpilot.enums.WorkMode;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ApplicationSummaryResponse(
        Long id,
        String companyName,
        String roleTitle,
        ApplicationStatus status,
        Priority priority,
        String location,
        WorkMode workMode,
        String salaryRange,
        LocalDate appliedDate,
        LocalDateTime nextRoundAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
