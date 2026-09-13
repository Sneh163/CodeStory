package com.codestory.backend.repository;

import com.codestory.backend.model.RequirementVersion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequirementVersionRepository
        extends JpaRepository<RequirementVersion, Long> {

    List<RequirementVersion> findByRequirementIdOrderByVersionNumberDesc(
            Long requirementId
    );

    Integer countByRequirementId(Long requirementId);
}