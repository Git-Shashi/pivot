package com.jobpilot.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ContactRequest(
        @NotBlank(message = "Name is required")
        String name,

        @Email(message = "Email must be valid")
        String email,

        String phone,
        String role,
        String linkedinUrl,
        String notes
) {
}
