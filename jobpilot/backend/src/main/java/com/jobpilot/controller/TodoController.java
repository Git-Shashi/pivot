package com.jobpilot.controller;

import com.jobpilot.dto.request.CreateTodoRequest;
import com.jobpilot.dto.response.ApiResponse;
import com.jobpilot.dto.response.TodoResponse;
import com.jobpilot.service.TodoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoResponse>>> list(
            @RequestParam(required = false) Long applicationId) {
        return ResponseEntity.ok(ApiResponse.of(todoService.list(applicationId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TodoResponse>> create(@Valid @RequestBody CreateTodoRequest request) {
        TodoResponse response = todoService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.of(response, "Todo added"));
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiResponse<TodoResponse>> toggle(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.of(todoService.toggle(id), "Todo updated"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        todoService.delete(id);
        return ResponseEntity.ok(ApiResponse.of(null, "Todo deleted"));
    }
}
