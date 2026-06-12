package com.jobpilot.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record CreateTodoRequest(
        @NotBlank(message = "Title is required")
        String title,

        LocalDate dueDate,
        Long applicationId
) {
}
