package com.jobpilot.dto.request;

import com.jobpilot.enums.Priority;
import com.jobpilot.enums.WorkMode;
import jakarta.validation.constraints.NotBlank;

public record CreateApplicationRequest(
        @NotBlank(message = "Company name is required")
        String companyName,

        @NotBlank(message = "Role title is required")
        String roleTitle,

        Long resumeId,
        String jobDescription,
        String jobUrl,
        String location,
        WorkMode workMode,
        String salaryRange,
        String notes,
        Priority priority
) {
}
