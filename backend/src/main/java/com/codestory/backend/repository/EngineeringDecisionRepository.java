package com.codestory.backend.repository;

import com.codestory.backend.model.EngineeringDecision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EngineeringDecisionRepository
        extends JpaRepository<EngineeringDecision, Long> {

    List<EngineeringDecision>
    findByRequirementIdOrderByCreatedAtDesc(
            Long requirementId
    );
}