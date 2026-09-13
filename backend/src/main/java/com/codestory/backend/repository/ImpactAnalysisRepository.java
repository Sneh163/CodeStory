package com.codestory.backend.repository;

import com.codestory.backend.model.ImpactAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImpactAnalysisRepository
        extends JpaRepository<ImpactAnalysis, Long> {

    List<ImpactAnalysis> findByRequirementIdOrderByAnalyzedAtDesc(
            Long requirementId
    );
}