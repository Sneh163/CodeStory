package com.codestory.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "engineering_decisions")
public class EngineeringDecision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, length = 100)
    private String type;

    @Column(columnDefinition = "TEXT")
    private String rationale;

    @Column(columnDefinition = "TEXT")
    private String implementationReference;

    @Column(columnDefinition = "TEXT")
    private String supportingEvidence;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public EngineeringDecision() {
    }

    public EngineeringDecision(
            Requirement requirement,
            String title,
            String type,
            String rationale,
            String implementationReference,
            String supportingEvidence
    ) {
        this.requirement = requirement;
        this.title = title;
        this.type = type;
        this.rationale = rationale;
        this.implementationReference = implementationReference;
        this.supportingEvidence = supportingEvidence;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Requirement getRequirement() {
        return requirement;
    }

    public void setRequirement(Requirement requirement) {
        this.requirement = requirement;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public String getImplementationReference() {
        return implementationReference;
    }

    public void setImplementationReference(
            String implementationReference
    ) {
        this.implementationReference =
                implementationReference;
    }

    public String getSupportingEvidence() {
        return supportingEvidence;
    }

    public void setSupportingEvidence(
            String supportingEvidence
    ) {
        this.supportingEvidence =
                supportingEvidence;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}