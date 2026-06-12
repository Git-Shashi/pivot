package com.jobpilot.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "resumes")
public class Resume extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private User user;

    @Column(nullable = false)
    private String label;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "cloudinary_public_id", nullable = false)
    private String cloudinaryPublicId;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "is_default", nullable = false)
    @Builder.Default
    private boolean isDefault = false;
}
