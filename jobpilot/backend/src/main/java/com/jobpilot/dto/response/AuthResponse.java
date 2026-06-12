package com.jobpilot.dto.response;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
