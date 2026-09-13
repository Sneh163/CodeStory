package com.codestory.backend.controller;

import com.codestory.backend.model.RequirementVersion;
import com.codestory.backend.service.RequirementVersionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class RequirementVersionController {

    private final RequirementVersionService versionService;

    public RequirementVersionController(
            RequirementVersionService versionService
    ) {
        this.versionService = versionService;
    }


    // =========================
    // CREATE VERSION
    // =========================

    @PostMapping("/{requirementId}/versions")
    public ResponseEntity<RequirementVersion> createVersion(
            @PathVariable Long requirementId,
            @RequestBody VersionRequest request
    ) {

        RequirementVersion version =
                versionService.createVersion(
                        requirementId,
                        request.getTitle(),
                        request.getDescription(),
                        request.getStatus()
                );

        return ResponseEntity.ok(version);
    }


    // =========================
    // GET ALL VERSIONS
    // =========================

    @GetMapping("/{requirementId}/versions")
    public ResponseEntity<List<RequirementVersion>> getVersions(
            @PathVariable Long requirementId
    ) {

        return ResponseEntity.ok(
                versionService.getVersions(
                        requirementId
                )
        );
    }


    // =========================
    // GET VERSION BY ID
    // =========================

    @GetMapping("/versions/{versionId}")
    public ResponseEntity<RequirementVersion> getVersion(
            @PathVariable Long versionId
    ) {

        return ResponseEntity.ok(
                versionService.getVersionById(
                        versionId
                )
        );
    }


    // =========================
    // COMPARE TWO VERSIONS
    // =========================

    @GetMapping(
            "/versions/{versionId}/compare/{otherVersionId}"
    )
    public ResponseEntity<Map<String, Object>> compareVersions(
            @PathVariable Long versionId,
            @PathVariable Long otherVersionId
    ) {

        return ResponseEntity.ok(
                versionService.compareVersions(
                        versionId,
                        otherVersionId
                )
        );
    }


    // =========================
    // REQUEST CLASS
    // =========================

    public static class VersionRequest {

        private String title;

        private String description;

        private String status;


        public String getTitle() {
            return title;
        }


        public void setTitle(String title) {
            this.title = title;
        }


        public String getDescription() {
            return description;
        }


        public void setDescription(
                String description
        ) {
            this.description = description;
        }


        public String getStatus() {
            return status;
        }


        public void setStatus(String status) {
            this.status = status;
        }
    }
}