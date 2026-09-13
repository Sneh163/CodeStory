package com.codestory.backend.controller;

import com.codestory.backend.model.ImpactAnalysis;
import com.codestory.backend.service.ImpactAnalysisService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class ImpactAnalysisController {

    private final ImpactAnalysisService impactAnalysisService;

    public ImpactAnalysisController(
            ImpactAnalysisService impactAnalysisService
    ) {
        this.impactAnalysisService = impactAnalysisService;
    }

    // =========================================================
    // CREATE IMPACT ANALYSIS
    // =========================================================

    @PostMapping("/{requirementId}/impact-analysis")
    public ResponseEntity<ImpactAnalysis> createAnalysis(
            @PathVariable Long requirementId,
            @RequestBody ImpactAnalysisRequest request
    ) {

        ImpactAnalysis analysis =
                impactAnalysisService.createAnalysis(
                        requirementId,
                        request.getChangeType(),
                        request.getSummary(),
                        request.getAffectedModules(),
                        request.getAffectedSourceFiles(),
                        request.getAffectedApis(),
                        request.getAffectedFunctionalities()
                );

        return ResponseEntity.ok(analysis);
    }

    // =========================================================
    // GET ALL ANALYSES FOR REQUIREMENT
    // =========================================================

    @GetMapping("/{requirementId}/impact-analysis")
    public ResponseEntity<List<ImpactAnalysis>> getAnalyses(
            @PathVariable Long requirementId
    ) {

        return ResponseEntity.ok(
                impactAnalysisService.getAnalyses(
                        requirementId
                )
        );
    }

    // =========================================================
    // GET ANALYSIS BY ID
    // =========================================================

    @GetMapping("/impact-analysis/{analysisId}")
    public ResponseEntity<ImpactAnalysis> getAnalysis(
            @PathVariable Long analysisId
    ) {

        return ResponseEntity.ok(
                impactAnalysisService.getAnalysisById(
                        analysisId
                )
        );
    }

    // =========================================================
    // DELETE ANALYSIS
    // =========================================================

    @DeleteMapping("/impact-analysis/{analysisId}")
    public ResponseEntity<Void> deleteAnalysis(
            @PathVariable Long analysisId
    ) {

        impactAnalysisService.deleteAnalysis(
                analysisId
        );

        return ResponseEntity.noContent()
                .build();
    }

    // =========================================================
    // REQUEST DTO
    // =========================================================

    public static class ImpactAnalysisRequest {

        private String changeType;

        private String summary;

        private String affectedModules;

        private String affectedSourceFiles;

        private String affectedApis;

        private String affectedFunctionalities;

        public String getChangeType() {
            return changeType;
        }

        public void setChangeType(
                String changeType
        ) {
            this.changeType =
                    changeType;
        }

        public String getSummary() {
            return summary;
        }

        public void setSummary(
                String summary
        ) {
            this.summary =
                    summary;
        }

        public String getAffectedModules() {
            return affectedModules;
        }

        public void setAffectedModules(
                String affectedModules
        ) {
            this.affectedModules =
                    affectedModules;
        }

        public String getAffectedSourceFiles() {
            return affectedSourceFiles;
        }

        public void setAffectedSourceFiles(
                String affectedSourceFiles
        ) {
            this.affectedSourceFiles =
                    affectedSourceFiles;
        }

        public String getAffectedApis() {
            return affectedApis;
        }

        public void setAffectedApis(
                String affectedApis
        ) {
            this.affectedApis =
                    affectedApis;
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
    }
}