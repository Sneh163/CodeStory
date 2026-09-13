package com.codestory.backend.service;

import com.codestory.backend.model.EngineeringDecision;
import com.codestory.backend.model.Requirement;
import com.codestory.backend.repository.EngineeringDecisionRepository;
import com.codestory.backend.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EngineeringDecisionService {

    private final EngineeringDecisionRepository
            decisionRepository;

    private final RequirementRepository
            requirementRepository;

    public EngineeringDecisionService(
            EngineeringDecisionRepository decisionRepository,
            RequirementRepository requirementRepository
    ) {
        this.decisionRepository = decisionRepository;
        this.requirementRepository = requirementRepository;
    }

    public EngineeringDecision createDecision(
            Long requirementId,
            String title,
            String type,
            String rationale,
            String implementationReference,
            String supportingEvidence
    ) {

        Requirement requirement =
                requirementRepository
                        .findById(requirementId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement not found with id: "
                                                + requirementId
                                )
                        );

        EngineeringDecision decision =
                new EngineeringDecision(
                        requirement,
                        title,
                        type,
                        rationale,
                        implementationReference,
                        supportingEvidence
                );

        return decisionRepository.save(
                decision
        );
    }

    public List<EngineeringDecision>
    getDecisions(Long requirementId) {

        return decisionRepository
                .findByRequirementIdOrderByCreatedAtDesc(
                        requirementId
                );
    }

    public EngineeringDecision
    getDecisionById(Long decisionId) {

        return decisionRepository
                .findById(decisionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Engineering decision not found with id: "
                                        + decisionId
                        )
                );
    }
}