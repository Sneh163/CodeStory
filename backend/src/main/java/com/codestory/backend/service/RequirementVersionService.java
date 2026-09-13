package com.codestory.backend.service;

import com.codestory.backend.model.Requirement;
import com.codestory.backend.model.RequirementVersion;
import com.codestory.backend.repository.RequirementRepository;
import com.codestory.backend.repository.RequirementVersionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RequirementVersionService {

    private final RequirementVersionRepository versionRepository;
    private final RequirementRepository requirementRepository;

    public RequirementVersionService(
            RequirementVersionRepository versionRepository,
            RequirementRepository requirementRepository
    ) {
        this.versionRepository = versionRepository;
        this.requirementRepository = requirementRepository;
    }


    // =========================
    // CREATE REQUIREMENT VERSION
    // =========================

    public RequirementVersion createVersion(
            Long requirementId,
            String title,
            String description,
            String status
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


        Integer currentVersion =
                versionRepository
                        .countByRequirementId(requirementId);


        Integer nextVersion =
                currentVersion + 1;


        RequirementVersion version =
                new RequirementVersion(
                        requirement,
                        nextVersion,
                        title,
                        description,
                        status
                );


        RequirementVersion savedVersion =
                versionRepository.save(version);


        // Update parent requirement timestamp
        requirement.setUpdatedAt(
                LocalDateTime.now()
        );

        requirementRepository.save(requirement);


        return savedVersion;
    }


    // =========================
    // GET ALL VERSIONS
    // =========================

    public List<RequirementVersion> getVersions(
            Long requirementId
    ) {

        return versionRepository
                .findByRequirementIdOrderByVersionNumberDesc(
                        requirementId
                );
    }


    // =========================
    // GET VERSION BY ID
    // =========================

    public RequirementVersion getVersionById(
            Long versionId
    ) {

        return versionRepository
                .findById(versionId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Requirement version not found with id: "
                                        + versionId
                        )
                );
    }


    // =========================
    // COMPARE TWO VERSIONS
    // =========================

    public Map<String, Object> compareVersions(
            Long versionId,
            Long otherVersionId
    ) {

        RequirementVersion version1 =
                versionRepository
                        .findById(versionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement version not found with id: "
                                                + versionId
                                )
                        );


        RequirementVersion version2 =
                versionRepository
                        .findById(otherVersionId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Requirement version not found with id: "
                                                + otherVersionId
                                )
                        );


        // Make sure both versions belong
        // to the same requirement
        if (!version1.getRequirement()
                .getId()
                .equals(
                        version2.getRequirement().getId()
                )) {

            throw new RuntimeException(
                    "Versions must belong to the same requirement"
            );

        }


        // =========================
        // VERSION INFORMATION
        // =========================

        Map<String, Object> result =
                new LinkedHashMap<>();


        result.put(
                "requirementId",
                version1.getRequirement().getId()
        );


        result.put(
                "requirementTitle",
                version1.getRequirement().getTitle()
        );


        result.put(
                "version1",
                createVersionInfo(version1)
        );


        result.put(
                "version2",
                createVersionInfo(version2)
        );


        // =========================
        // CHANGES
        // =========================

        Map<String, Boolean> changes =
                new LinkedHashMap<>();


        changes.put(
                "titleChanged",
                !safeEquals(
                        version1.getTitle(),
                        version2.getTitle()
                )
        );


        changes.put(
                "descriptionChanged",
                !safeEquals(
                        version1.getDescription(),
                        version2.getDescription()
                )
        );


        changes.put(
                "statusChanged",
                !safeEquals(
                        version1.getStatus(),
                        version2.getStatus()
                )
        );


        result.put(
                "changes",
                changes
        );


        // Overall result
        boolean anyChange =
                changes.values()
                        .stream()
                        .anyMatch(Boolean::booleanValue);


        result.put(
                "hasChanges",
                anyChange
        );


        return result;
    }


    // =========================
    // VERSION INFO
    // =========================

    private Map<String, Object> createVersionInfo(
            RequirementVersion version
    ) {

        Map<String, Object> info =
                new LinkedHashMap<>();


        info.put(
                "id",
                version.getId()
        );


        info.put(
                "versionNumber",
                version.getVersionNumber()
        );


        info.put(
                "title",
                version.getTitle()
        );


        info.put(
                "description",
                version.getDescription()
        );


        info.put(
                "status",
                version.getStatus()
        );


        info.put(
                "createdAt",
                version.getCreatedAt()
        );


        return info;
    }


    // =========================
    // SAFE STRING COMPARISON
    // =========================

    private boolean safeEquals(
            String first,
            String second
    ) {

        if (first == null && second == null) {
            return true;
        }


        if (first == null || second == null) {
            return false;
        }


        return first.equals(second);
    }
}