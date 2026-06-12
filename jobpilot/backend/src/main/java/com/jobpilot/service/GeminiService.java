package com.jobpilot.service;

import com.jobpilot.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    private static final String BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
    private static final int MAX_ATTEMPTS = 3;

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GeminiService(@Value("${gemini.api-key}") String apiKey,
                          @Value("${gemini.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        JdkClientHttpRequestFactory requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(30));

        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .requestFactory(requestFactory)
                .build();
    }

    @SuppressWarnings("unchecked")
    public String generateContent(String prompt) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BadRequestException("Gemini API key is not configured");
        }

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        Map<String, Object> response = null;
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                response = restClient.post()
                        .uri("/{model}:generateContent?key={apiKey}", model, apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(requestBody)
                        .retrieve()
                        .body(Map.class);
                break;
            } catch (HttpServerErrorException e) {
                log.warn("Gemini API attempt {}/{} failed with {}", attempt, MAX_ATTEMPTS, e.getStatusCode());
                if (attempt == MAX_ATTEMPTS) {
                    throw new BadRequestException("Failed to generate cover letter. Please try again later.");
                }
                sleep(Duration.ofSeconds(2L * attempt));
            } catch (RestClientException e) {
                log.error("Gemini API call failed", e);
                throw new BadRequestException("Failed to generate cover letter. Please try again later.");
            }
        }

        if (response == null) {
            throw new BadRequestException("Failed to generate cover letter. Please try again later.");
        }

        List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
        if (candidates == null || candidates.isEmpty()) {
            throw new BadRequestException("Failed to generate cover letter. Please try again later.");
        }

        Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
        List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
        if (parts == null || parts.isEmpty()) {
            throw new BadRequestException("Failed to generate cover letter. Please try again later.");
        }

        return (String) parts.get(0).get("text");
    }

    private void sleep(Duration duration) {
        try {
            Thread.sleep(duration.toMillis());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
