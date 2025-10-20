package com.pioneerpicks.pioneerpicks.professors;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    List<Professor> findByNameContainingIgnoreCase(String query);

    @Query("SELECT p FROM Professor p JOIN p.courses c WHERE c.id = :courseId")
    List<Professor> findByCourseId(UUID courseId);
}
