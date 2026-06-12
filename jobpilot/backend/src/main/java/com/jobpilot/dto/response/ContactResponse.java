package com.jobpilot.dto.response;

import java.time.LocalDateTime;

public record ContactResponse(
        Long id,
        String name,
        String email,
        String phone,
        String role,
        String linkedinUrl,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
