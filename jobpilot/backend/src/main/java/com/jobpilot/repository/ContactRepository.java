package com.jobpilot.repository;

import com.jobpilot.entity.Contact;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    List<Contact> findByApplicationId(Long applicationId);

    Optional<Contact> findByIdAndApplicationId(Long id, Long applicationId);
}
