package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    @Query("""
    SELECT r.professor.id AS professorId, COUNT(r) AS reviewCount
    FROM Review r
    WHERE r.course.id = :courseId
    GROUP BY r.professor.id
    """)
    List<ProfessorReviewCountDto> countReviewsGroupedByProfessor(@Param("courseId") UUID courseId);

    @Query("""
    SELECT r
    FROM Review r
    JOIN FETCH r.user
    JOIN FETCH r.course
    WHERE r.professor.id = :professorId
    AND r.course.id = :courseId
    """)
    List<Review> findReviewsWithUserAndCourse(@Param("professorId") UUID professorId, @Param("courseId") UUID courseId);

    @Query("""
    SELECT DISTINCT r
    FROM Review r
    WHERE r.user.id = :userId
    """)
    Optional<Review> findByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.professor.id = :professorId AND r.course.id = :courseId")
    long countByProfessorAndCourse(@Param("professorId") UUID professorId, @Param("courseId") UUID courseId);

}
