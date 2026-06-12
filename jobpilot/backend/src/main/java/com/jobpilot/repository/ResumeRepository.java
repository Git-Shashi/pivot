package com.jobpilot.repository;

import com.jobpilot.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ResumeRepository extends JpaRepository<Resume, Long> {

    List<Resume> findByUserId(Long userId);

    Optional<Resume> findByIdAndUserId(Long id, Long userId);

    Optional<Resume> findByUserIdAndIsDefaultTrue(Long userId);
}
