package com.codestory.backend.controller;

import com.codestory.backend.model.EngineeringDecision;
import com.codestory.backend.service.EngineeringDecisionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@CrossOrigin(origins = "http://localhost:5173")
public class EngineeringDecisionController {

    private final EngineeringDecisionService
            decisionService;

    public EngineeringDecisionController(
            EngineeringDecisionService decisionService
    ) {
        this.decisionService = decisionService;
    }

    @PostMapping("/{requirementId}/decisions")
    public ResponseEntity<EngineeringDecision>
    createDecision(
            @PathVariable Long requirementId,
            @RequestBody DecisionRequest request
    ) {

        EngineeringDecision decision =
                decisionService.createDecision(
                        requirementId,
                        request.getTitle(),
                        request.getType(),
                        request.getRationale(),
                        request.getImplementationReference(),
                        request.getSupportingEvidence()
                );

        return ResponseEntity.ok(
                decision
        );
    }

    @GetMapping("/{requirementId}/decisions")
    public ResponseEntity<List<EngineeringDecision>>
    getDecisions(
            @PathVariable Long requirementId
    ) {

        return ResponseEntity.ok(
                decisionService.getDecisions(
                        requirementId
                )
        );
    }

    @GetMapping("/decisions/{decisionId}")
    public ResponseEntity<EngineeringDecision>
    getDecision(
            @PathVariable Long decisionId
    ) {

        return ResponseEntity.ok(
                decisionService.getDecisionById(
                        decisionId
                )
        );
    }

    public static class DecisionRequest {

        private String title;
        private String type;
        private String rationale;
        private String implementationReference;
        private String supportingEvidence;

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getRationale() {
            return rationale;
        }

        public void setRationale(String rationale) {
            this.rationale = rationale;
        }

        public String getImplementationReference() {
            return implementationReference;
        }

        public void setImplementationReference(
                String implementationReference
        ) {
            this.implementationReference =
                    implementationReference;
        }

        public String getSupportingEvidence() {
            return supportingEvidence;
        }

        public void setSupportingEvidence(
                String supportingEvidence
        ) {
            this.supportingEvidence =
                    supportingEvidence;
        }
    }
}