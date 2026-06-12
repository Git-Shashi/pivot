package com.jobpilot.mapper;

import com.jobpilot.dto.response.ApplicationDetailResponse;
import com.jobpilot.dto.response.ApplicationResumeInfo;
import com.jobpilot.dto.response.ApplicationSummaryResponse;
import com.jobpilot.dto.response.ContactResponse;
import com.jobpilot.dto.response.ResumeSummaryResponse;
import com.jobpilot.dto.response.RoundResponse;
import com.jobpilot.dto.response.TodoResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.Contact;
import com.jobpilot.entity.Resume;
import com.jobpilot.entity.ApplicationRound;
import com.jobpilot.entity.TodoItem;
import com.jobpilot.entity.User;
import com.jobpilot.enums.RoundResult;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Component
public class ApplicationMapper {

    public ApplicationSummaryResponse toSummaryResponse(Application application) {
        LocalDateTime nextRoundAt = application.getRounds().stream()
                .filter(round -> round.getResult() == RoundResult.PENDING && round.getScheduledAt() != null)
                .map(ApplicationRound::getScheduledAt)
                .min(Comparator.naturalOrder())
                .orElse(null);

        return new ApplicationSummaryResponse(
                application.getId(),
                application.getCompanyName(),
                application.getRoleTitle(),
                application.getStatus(),
                application.getPriority(),
                application.getLocation(),
                application.getWorkMode(),
                application.getSalaryRange(),
                application.getAppliedDate(),
                nextRoundAt,
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }

    public ApplicationDetailResponse toDetailResponse(Application application, User user) {
        return new ApplicationDetailResponse(
                application.getId(),
                application.getCompanyName(),
                application.getRoleTitle(),
                application.getJobDescription(),
                application.getJobUrl(),
                application.getStatus(),
                application.getPriority(),
                application.getLocation(),
                application.getWorkMode(),
                application.getSalaryRange(),
                application.getNotes(),
                application.getCoverLetter(),
                application.getAppliedDate(),
                toResumeInfo(application, user),
                toRoundResponses(application.getRounds()),
                toContactResponses(application.getContacts()),
                toTodoResponses(application.getTodos()),
                application.getCreatedAt(),
                application.getUpdatedAt()
        );
    }

    public ApplicationResumeInfo toResumeInfo(Application application, User user) {
        if (application.getResume() != null) {
            return new ApplicationResumeInfo(toResumeSummary(application.getResume()), ApplicationResumeInfo.SOURCE_APPLICATION);
        }
        if (user.getDefaultResume() != null) {
            return new ApplicationResumeInfo(toResumeSummary(user.getDefaultResume()), ApplicationResumeInfo.SOURCE_DEFAULT);
        }
        return new ApplicationResumeInfo(null, ApplicationResumeInfo.SOURCE_NONE);
    }

    public ResumeSummaryResponse toResumeSummary(Resume resume) {
        return new ResumeSummaryResponse(
                resume.getId(),
                resume.getLabel(),
                resume.getFileName(),
                resume.getFileUrl(),
                resume.isDefault()
        );
    }

    public RoundResponse toRoundResponse(ApplicationRound round) {
        return new RoundResponse(
                round.getId(),
                round.getRoundNumber(),
                round.getRoundType(),
                round.getScheduledAt(),
                round.getResult(),
                round.getNotes(),
                round.getCreatedAt(),
                round.getUpdatedAt()
        );
    }

    public List<RoundResponse> toRoundResponses(List<ApplicationRound> rounds) {
        return rounds.stream().map(this::toRoundResponse).toList();
    }

    public ContactResponse toContactResponse(Contact contact) {
        return new ContactResponse(
                contact.getId(),
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getRole(),
                contact.getLinkedinUrl(),
                contact.getNotes(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }

    public List<ContactResponse> toContactResponses(List<Contact> contacts) {
        return contacts.stream().map(this::toContactResponse).toList();
    }

    public TodoResponse toTodoResponse(TodoItem todo) {
        return new TodoResponse(
                todo.getId(),
                todo.getTitle(),
                todo.getDueDate(),
                todo.isCompleted(),
                todo.getApplication() != null ? todo.getApplication().getId() : null,
                todo.getApplication() != null ? todo.getApplication().getCompanyName() : null
        );
    }

    public List<TodoResponse> toTodoResponses(List<TodoItem> todos) {
        return todos.stream().map(this::toTodoResponse).toList();
    }
}
