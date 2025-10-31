package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.reviews.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {

    @Query("""
    SELECT c.professor.id AS professorId, COUNT(c) AS commentCount
    FROM Comment c
    WHERE c.course.id = :courseId
    GROUP BY c.professor.id
    """)
    List<ProfessorCommentCountDto> countCommentsGroupedByProfessor(@Param("courseId") UUID courseId);

    @Query("""
    SELECT c
    FROM Comment c
    JOIN FETCH c.user
    JOIN FETCH c.course
    WHERE c.professor.id = :professorId
    AND c.course.id = :courseId
    """)
    List<Comment> findCommentsWithUserAndCourse(UUID professorId, UUID courseId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.professor.id = :professorId AND c.course.id = :courseId")
    long countByProfessorAndCourse(@Param("professorId") UUID professorId, @Param("courseId") UUID courseId);

}
