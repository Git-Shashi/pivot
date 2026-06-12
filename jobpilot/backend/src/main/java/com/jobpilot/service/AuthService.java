package com.jobpilot.service;

import com.jobpilot.dto.request.LoginRequest;
import com.jobpilot.dto.request.RegisterRequest;
import com.jobpilot.dto.request.UpdateProfileRequest;
import com.jobpilot.dto.response.AuthResponse;
import com.jobpilot.dto.response.UserResponse;
import com.jobpilot.entity.User;
import com.jobpilot.exception.BadRequestException;
import com.jobpilot.repository.UserRepository;
import com.jobpilot.security.CurrentUserService;
import com.jobpilot.security.JwtService;
import com.jobpilot.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsServiceImpl userDetailsService;
    private final CurrentUserService currentUserService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .build();

        User saved = userRepository.save(user);

        UserDetails userDetails = userDetailsService.loadUserByUsername(saved.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, toUserResponse(saved));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, toUserResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        return toUserResponse(currentUserService.getCurrentUser());
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = currentUserService.getCurrentUser();
        user.setFullName(request.fullName());
        user.setPhone(request.phone());
        user.setLinkedinUrl(request.linkedinUrl());
        return toUserResponse(userRepository.save(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getPhone(),
                user.getLinkedinUrl(),
                user.getDefaultResume() != null ? user.getDefaultResume().getId() : null
        );
    }
}
