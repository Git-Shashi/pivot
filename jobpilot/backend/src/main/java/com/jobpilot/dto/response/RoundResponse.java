package com.jobpilot.dto.response;

import com.jobpilot.enums.RoundResult;
import com.jobpilot.enums.RoundType;

import java.time.LocalDateTime;

public record RoundResponse(
        Long id,
        Integer roundNumber,
        RoundType roundType,
        LocalDateTime scheduledAt,
        RoundResult result,
        String notes,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
