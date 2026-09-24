package com.codestory.backend.service;

import com.codestory.backend.model.Requirement;
import com.codestory.backend.model.ProjectEvent;
import com.codestory.backend.repository.RequirementRepository;
import com.codestory.backend.repository.ProjectEventRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;
    private final ProjectEventRepository projectEventRepository;

    public RequirementService(
            RequirementRepository requirementRepository,
            ProjectEventRepository projectEventRepository) {

        this.requirementRepository = requirementRepository;
        this.projectEventRepository = projectEventRepository;
    }

    // ==============================
    // CREATE REQUIREMENT
    // ==============================

    public Requirement createRequirement(
            Requirement requirement) {

        Requirement savedRequirement =
                requirementRepository.save(requirement);

        // Create timeline event automatically
        ProjectEvent event = new ProjectEvent();

        event.setEventType("REQUIREMENT_CREATED");

        event.setDescription(
                savedRequirement.getTitle()
                        + " requirement created."
        );

        projectEventRepository.save(event);

        return savedRequirement;
    }

    // ==============================
    // GET ALL REQUIREMENTS
    // ==============================

    public List<Requirement> getAllRequirements() {

        return requirementRepository.findAll();
    }

    // ==============================
    // GET REQUIREMENT BY ID
    // ==============================

    public Requirement getRequirementById(Long id) {

        return requirementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Requirement not found with id: " + id
                        ));
    }

    // ==============================
    // UPDATE REQUIREMENT
    // ==============================

    public Requirement updateRequirement(
            Long id,
            Requirement updatedRequirement) {

        Requirement existingRequirement =
                getRequirementById(id);

        existingRequirement.setTitle(
                updatedRequirement.getTitle()
        );

        existingRequirement.setDescription(
                updatedRequirement.getDescription()
        );

        existingRequirement.setStatus(
                updatedRequirement.getStatus()
        );

        return requirementRepository.save(
                existingRequirement
        );
    }

    // ==============================
    // DELETE REQUIREMENT
    // ==============================

    public void deleteRequirement(Long id) {

        if (!requirementRepository.existsById(id)) {

            throw new RuntimeException(
                    "Requirement not found with id: " + id
            );
        }

        requirementRepository.deleteById(id);
    }
}