package com.jobpilot.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateCoverLetterRequest(
        @NotBlank(message = "Cover letter is required")
        String coverLetter
) {
}
