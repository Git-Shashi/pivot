package com.jobpilot.dto.request;

import com.jobpilot.enums.Priority;
import com.jobpilot.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record UpdateApplicationRequest(
        @NotBlank(message = "Company name is required")
        String companyName,

        @NotBlank(message = "Role title is required")
        String roleTitle,

        Long resumeId,
        String jobDescription,
        String jobUrl,
        LocalDate appliedDate,
        String salaryRange,
        String location,
        WorkMode workMode,
        String notes,
        Priority priority
) {
}
