package com.jobpilot.controller;

import com.jobpilot.dto.request.CreateRoundRequest;
import com.jobpilot.dto.request.UpdateRoundRequest;
import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.RoundResponse;
import com.jobpilot.service.ApplicationRoundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/applications/{appId}/rounds")
@RequiredArgsConstructor
public class ApplicationRoundController {

    private final ApplicationRoundService roundService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoundResponse>>> list(@PathVariable Long appId) {
        return ResponseEntity.ok(ApiResponse.of(roundService.list(appId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoundResponse>> create(
            @PathVariable Long appId, @Valid @RequestBody CreateRoundRequest request) {
        RoundResponse response = roundService.create(appId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(response, "Round added"));
    }

    @PutMapping("/{roundId}")
    public ResponseEntity<ApiResponse<RoundResponse>> update(
            @PathVariable Long appId, @PathVariable Long roundId, @Valid @RequestBody UpdateRoundRequest request) {
        RoundResponse response = roundService.update(appId, roundId, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Round updated"));
    }

    @DeleteMapping("/{roundId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long appId, @PathVariable Long roundId) {
        roundService.delete(appId, roundId);
        return ResponseEntity.ok(ApiResponse.of(null, "Round deleted"));
    }
}
