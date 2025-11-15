package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.courses.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {

    @Query("""
    SELECT DISTINCT p
    FROM Professor p
    LEFT JOIN FETCH p.courses c
    LEFT JOIN FETCH c.subject
    WHERE p.id = :professorId
    """)
    Optional<Professor> findProfessorWithCoursesAndSubjects(@Param("professorId") UUID professorId);

    List<Professor> findByNameContainingIgnoreCase(String query);

    @Query("SELECT p FROM Professor p JOIN p.courses c WHERE c.id = :courseId")
    List<Professor> findByCourseId(@Param("courseId") UUID courseId);
}
