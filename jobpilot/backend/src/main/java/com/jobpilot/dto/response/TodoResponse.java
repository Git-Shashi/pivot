package com.jobpilot.dto.response;

import java.time.LocalDate;

public record TodoResponse(
        Long id,
        String title,
        LocalDate dueDate,
        boolean isCompleted,
        Long applicationId,
        String applicationCompanyName
) {
}
