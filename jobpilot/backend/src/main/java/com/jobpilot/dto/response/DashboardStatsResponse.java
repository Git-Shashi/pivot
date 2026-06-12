package com.jobpilot.dto.response;

import com.jobpilot.enums.ApplicationStatus;

import java.util.Map;

public record DashboardStatsResponse(
        long total,
        Map<ApplicationStatus, Long> byStatus,
        long thisWeek,
        double responseRate
) {
}
