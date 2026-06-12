package com.jobpilot.repository;

import com.jobpilot.entity.TodoItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TodoItemRepository extends JpaRepository<TodoItem, Long> {

    List<TodoItem> findByUserIdOrderByDueDateAsc(Long userId);

    List<TodoItem> findByUserIdAndApplicationIdOrderByDueDateAsc(Long userId, Long applicationId);

    Optional<TodoItem> findByIdAndUserId(Long id, Long userId);
}
