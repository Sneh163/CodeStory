package com.codestory.backend.repository;

import com.codestory.backend.model.ProjectEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectEventRepository
        extends JpaRepository<ProjectEvent, Long> {

    List<ProjectEvent> findAllByOrderByTimestampDesc();
}