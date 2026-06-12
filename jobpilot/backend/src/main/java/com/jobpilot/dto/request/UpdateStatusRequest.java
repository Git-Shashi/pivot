package com.jobpilot.dto.request;

import com.jobpilot.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateStatusRequest(
        @NotNull(message = "Status is required")
        ApplicationStatus status
) {
}
