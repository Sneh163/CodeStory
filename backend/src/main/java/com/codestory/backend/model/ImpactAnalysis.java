package com.codestory.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "impact_analyses")
public class ImpactAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requirement_id", nullable = false)
    private Requirement requirement;

    @Column(nullable = false, length = 100)
    private String changeType;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String affectedModules;

    @Column(columnDefinition = "TEXT")
    private String affectedSourceFiles;

    @Column(columnDefinition = "TEXT")
    private String affectedApis;

    @Column(columnDefinition = "TEXT")
    private String affectedFunctionalities;

    @Column(nullable = false)
    private LocalDateTime analyzedAt;

    public ImpactAnalysis() {
    }

    public ImpactAnalysis(
            Requirement requirement,
            String changeType,
            String summary,
            String affectedModules,
            String affectedSourceFiles,
            String affectedApis,
            String affectedFunctionalities
    ) {
        this.requirement = requirement;
        this.changeType = changeType;
        this.summary = summary;
        this.affectedModules = affectedModules;
        this.affectedSourceFiles = affectedSourceFiles;
        this.affectedApis = affectedApis;
        this.affectedFunctionalities = affectedFunctionalities;
        this.analyzedAt = LocalDateTime.now();
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

    public String getChangeType() {
        return changeType;
    }

    public void setChangeType(String changeType) {
        this.changeType = changeType;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getAffectedModules() {
        return affectedModules;
    }

    public void setAffectedModules(String affectedModules) {
        this.affectedModules = affectedModules;
    }

    public String getAffectedSourceFiles() {
        return affectedSourceFiles;
    }

    public void setAffectedSourceFiles(String affectedSourceFiles) {
        this.affectedSourceFiles = affectedSourceFiles;
    }

    public String getAffectedApis() {
        return affectedApis;
    }

    public void setAffectedApis(String affectedApis) {
        this.affectedApis = affectedApis;
    }

    public String getAffectedFunctionalities() {
        return affectedFunctionalities;
    }

    public void setAffectedFunctionalities(
            String affectedFunctionalities
    ) {
        this.affectedFunctionalities =
                affectedFunctionalities;
    }

    public LocalDateTime getAnalyzedAt() {
        return analyzedAt;
    }

    public void setAnalyzedAt(
            LocalDateTime analyzedAt
    ) {
        this.analyzedAt = analyzedAt;
    }
}