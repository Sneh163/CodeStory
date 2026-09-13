package com.codestory.backend.repository;

import com.codestory.backend.model.Requirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequirementRepository
        extends JpaRepository<Requirement, Long> {
}