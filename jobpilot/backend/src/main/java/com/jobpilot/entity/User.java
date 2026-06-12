package com.jobpilot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "users")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    private String phone;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "default_resume_id")
    @ToString.Exclude
    private Resume defaultResume;

    @OneToMany(mappedBy = "user", cascade = jakarta.persistence.CascadeType.ALL)
    @Builder.Default
    @ToString.Exclude
    private List<Resume> resumes = new ArrayList<>();
}
