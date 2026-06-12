package com.jobpilot.controller;

import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.DashboardStatsResponse;
import com.jobpilot.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> stats() {
        return ResponseEntity.ok(ApiResponse.of(dashboardService.getStats()));
    }
}
