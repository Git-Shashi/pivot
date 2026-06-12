package com.jobpilot.controller;

import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.ResumeResponse;
import com.jobpilot.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ResumeResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.of(resumeService.list()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> upload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("label") String label) {
        ResumeResponse response = resumeService.upload(file, label);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(response, "Resume uploaded"));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<ApiResponse<ResumeResponse>> setDefault(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(resumeService.setDefault(id), "Default resume updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        resumeService.delete(id);
        return ResponseEntity.ok(ApiResponse.of(null, "Resume deleted"));
    }
}
