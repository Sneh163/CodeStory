package com.codestory.backend.service;

import com.codestory.backend.model.ProjectEvent;
import com.codestory.backend.repository.ProjectEventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectEventService {

    private final ProjectEventRepository projectEventRepository;

    public ProjectEventService(
            ProjectEventRepository projectEventRepository
    ) {
        this.projectEventRepository = projectEventRepository;
    }

    public ProjectEvent createEvent(
            String eventType,
            String description
    ) {

        ProjectEvent event =
                new ProjectEvent(
                        eventType,
                        description
                );

        return projectEventRepository.save(event);
    }

    public List<ProjectEvent> getAllEvents() {

        return projectEventRepository
                .findAllByOrderByTimestampDesc();
    }

    public ProjectEvent getEventById(Long id) {

        return projectEventRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Project event not found with id: " + id
                        )
                );
    }
}