package com.codestory.backend.controller;

import com.codestory.backend.model.ProjectEvent;
import com.codestory.backend.service.ProjectEventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class ProjectEventController {

    private final ProjectEventService projectEventService;

    public ProjectEventController(
            ProjectEventService projectEventService
    ) {
        this.projectEventService = projectEventService;
    }

    @PostMapping
    public ResponseEntity<ProjectEvent> createEvent(
            @RequestBody EventRequest request
    ) {

        ProjectEvent event =
                projectEventService.createEvent(
                        request.getEventType(),
                        request.getDescription()
                );

        return ResponseEntity.ok(event);
    }

    @GetMapping
    public ResponseEntity<List<ProjectEvent>> getAllEvents() {

        return ResponseEntity.ok(
                projectEventService.getAllEvents()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectEvent> getEventById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                projectEventService.getEventById(id)
        );
    }

    public static class EventRequest {

        private String eventType;
        private String description;

        public String getEventType() {
            return eventType;
        }

        public void setEventType(String eventType) {
            this.eventType = eventType;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}