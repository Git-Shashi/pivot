package com.jobpilot.repository;

import com.jobpilot.entity.ApplicationRound;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRoundRepository extends JpaRepository<ApplicationRound, Long> {

    List<ApplicationRound> findByApplicationIdOrderByRoundNumberAsc(Long applicationId);

    Optional<ApplicationRound> findByIdAndApplicationId(Long id, Long applicationId);

    long countByApplicationId(Long applicationId);
}
