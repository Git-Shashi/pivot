package com.jobpilot.controller;

import com.jobpilot.dto.request.ContactRequest;
import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.ContactResponse;
import com.jobpilot.service.ContactService;
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
@RequestMapping("/api/v1/applications/{appId}/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactResponse>>> list(@PathVariable Long appId) {
        return ResponseEntity.ok(ApiResponse.of(contactService.list(appId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContactResponse>> create(
            @PathVariable Long appId, @Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.create(appId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(response, "Contact added"));
    }

    @PutMapping("/{contactId}")
    public ResponseEntity<ApiResponse<ContactResponse>> update(
            @PathVariable Long appId, @PathVariable Long contactId, @Valid @RequestBody ContactRequest request) {
        ContactResponse response = contactService.update(appId, contactId, request);
        return ResponseEntity.ok(ApiResponse.of(response, "Contact updated"));
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long appId, @PathVariable Long contactId) {
        contactService.delete(appId, contactId);
        return ResponseEntity.ok(ApiResponse.of(null, "Contact deleted"));
    }
}
