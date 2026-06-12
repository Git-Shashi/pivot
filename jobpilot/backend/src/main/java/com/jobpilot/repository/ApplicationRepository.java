package com.jobpilot.repository;

import com.jobpilot.entity.Application;
import com.jobpilot.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Application> findByUserIdAndStatusOrderByCreatedAtDesc(Long userId, ApplicationStatus status);

    Optional<Application> findByIdAndUserId(Long id, Long userId);

    long countByUserId(Long userId);

    long countByUserIdAndStatus(Long userId, ApplicationStatus status);

    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime after);

    @Query("SELECT a FROM Application a WHERE a.user.id = :userId " +
            "AND (:status IS NULL OR a.status = :status) " +
            "AND (:search IS NULL OR LOWER(a.companyName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')) " +
            "     OR LOWER(a.roleTitle) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))) " +
            "ORDER BY a.createdAt DESC")
    List<Application> search(@Param("userId") Long userId,
                              @Param("status") ApplicationStatus status,
                              @Param("search") String search);
}
