package com.codestory.backend.service;

import com.codestory.backend.model.ProjectEvent;
import com.codestory.backend.model.Requirement;
import com.codestory.backend.model.RequirementVersion;
import com.codestory.backend.repository.ProjectEventRepository;
import com.codestory.backend.repository.RequirementRepository;
import com.codestory.backend.repository.RequirementVersionRepository;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class RequirementVersionService {

    private final RequirementVersionRepository versionRepository;
    private final RequirementRepository requirementRepository;
    private final ProjectEventRepository projectEventRepository;

    public RequirementVersionService(
            RequirementVersionRepository versionRepository,
            RequirementRepository requirementRepository,
            ProjectEventRepository projectEventRepository
    ) {
        this.versionRepository = versionRepository;
        this.requirementRepository = requirementRepository;
        this.projectEventRepository = projectEventRepository;
    }


    // =========================
    // CREATE VERSION
    // =========================

    public RequirementVersion createVersion(
            Long requirementId,
            String title,
            String description,
            String status
    ) {

        Requirement requirement = requirementRepository
                .findById(requirementId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Requirement not found with id: "
                                        + requirementId
                        )
                );

        Integer currentVersion =
                versionRepository.countByRequirementId(requirementId);

        Integer nextVersion = currentVersion + 1;

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


        // =========================
        // EVOLUTION TIMELINE EVENT
        // =========================

        ProjectEvent event = new ProjectEvent(
                "VERSION_CREATED",
                "Version V"
                        + nextVersion
                        + " created for "
                        + requirement.getTitle()
                        + " requirement."
        );

        projectEventRepository.save(event);

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
                getVersionById(versionId);

        RequirementVersion version2 =
                getVersionById(otherVersionId);


        // =========================
        // CHECK SAME REQUIREMENT
        // =========================

        if (!version1.getRequirement()
                .getId()
                .equals(
                        version2.getRequirement().getId()
                )) {

            throw new RuntimeException(
                    "Cannot compare versions belonging to different requirements."
            );
        }


        // =========================
        // CHANGE DETECTION
        // =========================

        boolean titleChanged =
                !safeEquals(
                        version1.getTitle(),
                        version2.getTitle()
                );

        boolean descriptionChanged =
                !safeEquals(
                        version1.getDescription(),
                        version2.getDescription()
                );

        boolean statusChanged =
                !safeEquals(
                        version1.getStatus(),
                        version2.getStatus()
                );

        boolean hasChanges =
                titleChanged
                        || descriptionChanged
                        || statusChanged;


        // =========================
        // RESULT
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
                createVersionData(version1)
        );

        result.put(
                "version2",
                createVersionData(version2)
        );


        Map<String, Boolean> changes =
                new LinkedHashMap<>();

        changes.put(
                "titleChanged",
                titleChanged
        );

        changes.put(
                "descriptionChanged",
                descriptionChanged
        );

        changes.put(
                "statusChanged",
                statusChanged
        );

        changes.put(
                "hasChanges",
                hasChanges
        );


        result.put(
                "changes",
                changes
        );


        return result;
    }


    // =========================
    // VERSION DATA
    // =========================

    private Map<String, Object> createVersionData(
            RequirementVersion version
    ) {

        Map<String, Object> data =
                new LinkedHashMap<>();

        data.put(
                "id",
                version.getId()
        );

        data.put(
                "versionNumber",
                version.getVersionNumber()
        );

        data.put(
                "title",
                version.getTitle()
        );

        data.put(
                "description",
                version.getDescription()
        );

        data.put(
                "status",
                version.getStatus()
        );

        data.put(
                "createdAt",
                version.getCreatedAt()
        );

        return data;
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