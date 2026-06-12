package com.jobpilot.dto.request;

import com.jobpilot.enums.RoundType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record CreateRoundRequest(
        @NotNull(message = "Round type is required")
        RoundType roundType,

        LocalDateTime scheduledAt,
        String notes
) {
}
