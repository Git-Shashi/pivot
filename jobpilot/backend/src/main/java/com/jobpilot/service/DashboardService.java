package com.jobpilot.service;

import com.jobpilot.dto.response.DashboardStatsResponse;
import com.jobpilot.enums.ApplicationStatus;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final ApplicationRepository applicationRepository;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats() {
        Long userId = currentUserService.getCurrentUserId();

        Map<ApplicationStatus, Long> byStatus = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            byStatus.put(status, 0L);
        }
        long total = 0;
        for (Object[] row : applicationRepository.countGroupedByStatus(userId)) {
            long count = (Long) row[1];
            byStatus.put((ApplicationStatus) row[0], count);
            total += count;
        }

        long thisWeek = applicationRepository.countByUserIdAndCreatedAtAfter(userId, LocalDateTime.now().minusDays(7));

        long bookmarked = byStatus.get(ApplicationStatus.BOOKMARKED);
        long appliedOrBeyond = total - bookmarked;
        long noResponse = byStatus.get(ApplicationStatus.APPLIED) + byStatus.get(ApplicationStatus.GHOSTED);
        long responded = appliedOrBeyond - noResponse;
        double responseRate = appliedOrBeyond > 0 ? (responded * 100.0) / appliedOrBeyond : 0.0;

        return new DashboardStatsResponse(total, byStatus, thisWeek, responseRate);
    }
}
