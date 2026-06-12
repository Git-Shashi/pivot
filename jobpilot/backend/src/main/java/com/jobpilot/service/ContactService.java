package com.jobpilot.service;

import com.jobpilot.dto.request.ContactRequest;
import com.jobpilot.dto.response.ContactResponse;
import com.jobpilot.entity.Application;
import com.jobpilot.entity.Contact;
import com.jobpilot.entity.User;
import com.jobpilot.exception.ResourceNotFoundException;
import com.jobpilot.mapper.ApplicationMapper;
import com.jobpilot.repository.ApplicationRepository;
import com.jobpilot.repository.ContactRepository;
import com.jobpilot.security.CurrentUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationMapper applicationMapper;
    private final CurrentUserService currentUserService;

    @Transactional(readOnly = true)
    public List<ContactResponse> list(Long appId) {
        Application application = findOwnedApplication(appId);
        return applicationMapper.toContactResponses(application.getContacts());
    }

    @Transactional
    public ContactResponse create(Long appId, ContactRequest request) {
        User user = currentUserService.getCurrentUser();
        Application application = findOwnedApplication(appId, user.getId());

        Contact contact = Contact.builder()
                .application(application)
                .user(user)
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .role(request.role())
                .linkedinUrl(request.linkedinUrl())
                .notes(request.notes())
                .build();

        application.getContacts().add(contact);

        return applicationMapper.toContactResponse(contactRepository.save(contact));
    }

    @Transactional
    public ContactResponse update(Long appId, Long contactId, ContactRequest request) {
        Application application = findOwnedApplication(appId);
        Contact contact = contactRepository.findByIdAndApplicationId(contactId, application.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        contact.setName(request.name());
        contact.setEmail(request.email());
        contact.setPhone(request.phone());
        contact.setRole(request.role());
        contact.setLinkedinUrl(request.linkedinUrl());
        contact.setNotes(request.notes());

        return applicationMapper.toContactResponse(contact);
    }

    @Transactional
    public void delete(Long appId, Long contactId) {
        Application application = findOwnedApplication(appId);
        Contact contact = contactRepository.findByIdAndApplicationId(contactId, application.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found"));

        contactRepository.delete(contact);
    }

    private Application findOwnedApplication(Long appId) {
        return findOwnedApplication(appId, currentUserService.getCurrentUserId());
    }

    private Application findOwnedApplication(Long appId, Long userId) {
        return applicationRepository.findByIdAndUserId(appId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
    }
}
