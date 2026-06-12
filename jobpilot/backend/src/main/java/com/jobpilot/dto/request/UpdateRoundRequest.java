package com.jobpilot.dto.request;

import com.jobpilot.enums.RoundResult;
import com.jobpilot.enums.RoundType;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record UpdateRoundRequest(
        @NotNull(message = "Round type is required")
        RoundType roundType,

        LocalDateTime scheduledAt,

        @NotNull(message = "Result is required")
        RoundResult result,

        String notes
) {
}
