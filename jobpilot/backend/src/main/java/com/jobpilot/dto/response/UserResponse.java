package com.jobpilot.dto.response;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        String phone,
        String linkedinUrl,
        Long defaultResumeId
) {
}
