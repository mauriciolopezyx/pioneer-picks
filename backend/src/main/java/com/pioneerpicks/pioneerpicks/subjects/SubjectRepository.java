package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    List<Subject> findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(String q1, String q2);

    Optional<Subject> findByNameContainingIgnoreCase(String query);
    List<Subject> findByAbbreviation(String query);

    @Query("""
    SELECT c
    FROM Subject s
    JOIN s.courses c
    WHERE s.id = :subjectId
    """)
    Page<Course> findCourses(@Param("subjectId") UUID subjectId, Pageable pageable);

    Optional<Subject> findByName(@NotBlank String subject);

}
