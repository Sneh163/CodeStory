package com.codestory.backend.service;

import com.codestory.backend.model.ImpactAnalysis;
import com.codestory.backend.model.Requirement;
import com.codestory.backend.repository.ImpactAnalysisRepository;
import com.codestory.backend.repository.RequirementRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ImpactAnalysisService {

    private final ImpactAnalysisRepository impactAnalysisRepository;
    private final RequirementRepository requirementRepository;

    public ImpactAnalysisService(
            ImpactAnalysisRepository impactAnalysisRepository,
            RequirementRepository requirementRepository
    ) {
        this.impactAnalysisRepository = impactAnalysisRepository;
        this.requirementRepository = requirementRepository;
    }

    // =========================================================
    // CREATE IMPACT ANALYSIS
    // =========================================================

    public ImpactAnalysis createAnalysis(
            Long requirementId,
            String changeType,
            String summary,
            String affectedModules,
            String affectedSourceFiles,
            String affectedApis,
            String affectedFunctionalities
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

        ImpactAnalysis analysis =
                new ImpactAnalysis(
                        requirement,
                        changeType,
                        summary,
                        affectedModules,
                        affectedSourceFiles,
                        affectedApis,
                        affectedFunctionalities
                );

        return impactAnalysisRepository.save(
                analysis
        );
    }

    // =========================================================
    // GET ALL ANALYSES FOR A REQUIREMENT
    // =========================================================

    public List<ImpactAnalysis> getAnalyses(
            Long requirementId
    ) {

        return impactAnalysisRepository
                .findByRequirementIdOrderByAnalyzedAtDesc(
                        requirementId
                );
    }

    // =========================================================
    // GET ANALYSIS BY ID
    // =========================================================

    public ImpactAnalysis getAnalysisById(
            Long analysisId
    ) {

        return impactAnalysisRepository
                .findById(analysisId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Impact analysis not found with id: "
                                        + analysisId
                        )
                );
    }

    // =========================================================
    // DELETE ANALYSIS
    // =========================================================

    public void deleteAnalysis(
            Long analysisId
    ) {

        if (!impactAnalysisRepository
                .existsById(analysisId)) {

            throw new RuntimeException(
                    "Impact analysis not found with id: "
                            + analysisId
            );
        }

        impactAnalysisRepository.deleteById(
                analysisId
        );
    }
}