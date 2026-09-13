package com.codestory.backend.controller;

import com.codestory.backend.model.Requirement;
import com.codestory.backend.service.RequirementService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class RequirementController {

    private final RequirementService requirementService;

    public RequirementController(
            RequirementService requirementService) {

        this.requirementService = requirementService;
    }

    @PostMapping
    public ResponseEntity<Requirement> createRequirement(
            @Valid @RequestBody Requirement requirement) {

        Requirement created =
                requirementService.createRequirement(
                        requirement
                );

        return new ResponseEntity<>(
                created,
                HttpStatus.CREATED
        );
    }

    @GetMapping
    public ResponseEntity<List<Requirement>>
    getAllRequirements() {

        return ResponseEntity.ok(
                requirementService.getAllRequirements()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Requirement>
    getRequirementById(@PathVariable Long id) {

        return ResponseEntity.ok(
                requirementService.getRequirementById(id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Requirement>
    updateRequirement(
            @PathVariable Long id,
            @Valid @RequestBody Requirement requirement) {

        return ResponseEntity.ok(
                requirementService.updateRequirement(
                        id,
                        requirement
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteRequirement(@PathVariable Long id) {

        requirementService.deleteRequirement(id);

        return ResponseEntity.noContent().build();
    }
}