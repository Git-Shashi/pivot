package com.jobpilot.service;

import com.jobpilot.dto.request.CreateRoundRequest;
import com.jobpilot.dto.request.UpdateRoundRequest;
import com.jobpilot.dto.response.RoundResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.ApplicationRound;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.mapper.ApplicationMapper;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.repository.ApplicationRoundRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationRoundService {

    private final ApplicationRoundRepository roundRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<RoundResponse> list(Long appId) {
        Application application = findOwnedApplication(appId);
        return applicationMapper.toRoundResponses(application.getRounds());
    }

    @Transactional
    public RoundResponse create(Long appId, CreateRoundRequest request) {
        Application application = findOwnedApplication(appId);

        long nextRoundNumber = roundRepository.countByApplicationId(application.getId()) + 1;

        ApplicationRound round = ApplicationRound.builder()
                .application(application)
                .roundNumber((int) nextRoundNumber)
                .roundType(request.roundType())
                .scheduledAt(request.scheduledAt())
                .notes(request.notes())
                .build();

        application.getRounds().add(round);

        return applicationMapper.toRoundResponse(roundRepository.save(round));
    }

    @Transactional
    public RoundResponse update(Long appId, Long roundId, UpdateRoundRequest request) {
        Application application = findOwnedApplication(appId);
        ApplicationRound round = roundRepository.findByIdAndApplicationId(roundId, application.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Round not found"));

        round.setRoundType(request.roundType());
        round.setScheduledAt(request.scheduledAt());
        round.setResult(request.result());
        round.setNotes(request.notes());

        return applicationMapper.toRoundResponse(round);
    }

    @Transactional
    public void delete(Long appId, Long roundId) {
        Application application = findOwnedApplication(appId);
        ApplicationRound round = roundRepository.findByIdAndApplicationId(roundId, application.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Round not found"));

        roundRepository.delete(round);
    }

    private Application findOwnedApplication(Long appId) {
        Long userId = currentUserService.getCurrentUserId();
        return applicationRepository.findByIdAndUserId(appId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }
}
