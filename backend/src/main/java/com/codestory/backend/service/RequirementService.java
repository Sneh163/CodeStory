package com.codestory.backend.service;

import com.codestory.backend.model.Requirement;
import com.codestory.backend.repository.RequirementRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RequirementService {

    private final RequirementRepository requirementRepository;

    public RequirementService(
            RequirementRepository requirementRepository) {

        this.requirementRepository = requirementRepository;
    }

    public Requirement createRequirement(
            Requirement requirement) {

        return requirementRepository.save(requirement);
    }

    public List<Requirement> getAllRequirements() {

        return requirementRepository.findAll();
    }

    public Requirement getRequirementById(Long id) {

        return requirementRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Requirement not found with id: " + id
                        ));
    }

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

    public void deleteRequirement(Long id) {

        if (!requirementRepository.existsById(id)) {
            throw new RuntimeException(
                    "Requirement not found with id: " + id
            );
        }

        requirementRepository.deleteById(id);
    }
}