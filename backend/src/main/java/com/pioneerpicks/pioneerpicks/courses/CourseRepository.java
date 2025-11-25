package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    @Query("""
    SELECT c
    FROM Course c
    WHERE LOWER(c.areas) LIKE LOWER(CONCAT('%', :q, '%'))
    """)
    Page<Course> findCoursesByArea(@Param("q") String q, Pageable pageable);

    @Query("""
    SELECT p
    FROM Course c
    JOIN c.professors p
    WHERE c.id = :courseId
    """)
    Page<Professor> findProfessors(@Param("courseId") UUID courseId, Pageable pageable);

    @Query("""
    SELECT DISTINCT c
    FROM Course c
    JOIN FETCH c.subject s
    WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :q, '%'))
       OR LOWER(c.abbreviation) LIKE LOWER(CONCAT('%', :q, '%'))
    """)
    List<Course> findCoursesWithSubject(@Param("q") String q);

    List<Course> findBySubjectId(UUID subjectId);

}
