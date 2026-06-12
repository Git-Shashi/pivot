package com.jobpilot.controller;

import com.jobpilot.dto.request.CreateApplicationRequest;
import com.jobpilot.dto.request.GenerateCoverLetterRequest;
import com.jobpilot.dto.request.UpdateApplicationRequest;
import com.jobpilot.dto.request.UpdateCoverLetterRequest;
import com.jobpilot.dto.request.UpdateStatusRequest;
import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.ApplicationDetailResponse;
import com.jobpilot.dto.response.ApplicationSummaryResponse;
import com.jobpilot.enums.ApplicationStatus;
import com.jobpilot.service.ApplicationService;
import com.jobpilot.service.CoverLetterService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CoverLetterService coverLetterService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ApplicationSummaryResponse>>> list(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.of(applicationService.list(status, search)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(applicationService.getDetail(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> create(@Valid @RequestBody CreateApplicationRequest request) {
        ApplicationDetailResponse response = applicationService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.of(response, "Application created"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> update(
            @PathVariable Long id, @Valid @RequestBody UpdateApplicationRequest request) {
        ApplicationDetailResponse response = applicationService.update(id, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Application updated"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> updateStatus(
            @PathVariable Long id, @Valid @RequestBody UpdateStatusRequest request) {
        ApplicationDetailResponse response = applicationService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Status updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ResponseEntity.ok(ApiResponse.of(null, "Application deleted"));
    }

    @PostMapping("/{id}/cover-letter/generate")
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> generateCoverLetter(
            @PathVariable Long id, @RequestBody(required = false) GenerateCoverLetterRequest request) {
        ApplicationDetailResponse response = coverLetterService.generate(id, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Cover letter generated"));
    }

    @PutMapping("/{id}/cover-letter")
    public ResponseEntity<ApiResponse<ApplicationDetailResponse>> updateCoverLetter(
            @PathVariable Long id, @Valid @RequestBody UpdateCoverLetterRequest request) {
        ApplicationDetailResponse response = coverLetterService.update(id, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Cover letter updated"));
    }
}
