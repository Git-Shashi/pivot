package com.jobpilot.dto.response;

public record ResumeSummaryResponse(
        Long id,
        String label,
        String fileName,
        String fileUrl,
        boolean isDefault
) {
}
