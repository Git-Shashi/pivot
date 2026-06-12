package com.jobpilot.dto.response;

import java.time.LocalDateTime;

public record ResumeResponse(
        Long id,
        String label,
        String fileName,
        String fileUrl,
        boolean isDefault,
        LocalDateTime createdAt
) {
}
