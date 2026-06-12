package com.jobpilot.dto.response;

public record ApiResponse<T>(T data, String message) {

    public static <T> ApiResponse<T> of(T data, String message) {
        return new ApiResponse<>(data, message);
    }

    public static <T> ApiResponse<T> of(T data) {
        return new ApiResponse<>(data, null);
    }
}
