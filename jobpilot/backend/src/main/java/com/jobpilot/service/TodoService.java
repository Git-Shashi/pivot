package com.jobpilot.service;

import com.jobpilot.dto.request.CreateTodoRequest;
import com.jobpilot.dto.response.TodoResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.TodoItem;
import com.jobpilot.entity.User;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.mapper.ApplicationMapper;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.repository.TodoItemRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TodoService {

    private final TodoItemRepository todoItemRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<TodoResponse> list(Long applicationId) {
        Long userId = currentUserService.getCurrentUserId();
        List<TodoItem> todos = applicationId != null
                ? todoItemRepository.findByUserIdAndApplicationIdOrderByDueDateAsc(userId, applicationId)
                : todoItemRepository.findByUserIdOrderByDueDateAsc(userId);

        return applicationMapper.toTodoResponses(todos);
    }

    @Transactional
    public TodoResponse create(CreateTodoRequest request) {
        User user = currentUserService.getCurrentUser();

        Application application = null;
        if (request.applicationId() != null) {
            application = applicationRepository.findByIdAndUserId(request.applicationId(), user.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        }

        TodoItem todo = TodoItem.builder()
                .user(user)
                .application(application)
                .title(request.title())
                .dueDate(request.dueDate())
                .build();

        return applicationMapper.toTodoResponse(todoItemRepository.save(todo));
    }

    @Transactional
    public TodoResponse toggle(Long id) {
        Long userId = currentUserService.getCurrentUserId();
        TodoItem todo = todoItemRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        todo.setCompleted(!todo.isCompleted());

        return applicationMapper.toTodoResponse(todo);
    }

    @Transactional
    public void delete(Long id) {
        Long userId = currentUserService.getCurrentUserId();
        TodoItem todo = todoItemRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Todo not found"));

        todoItemRepository.delete(todo);
    }
}
