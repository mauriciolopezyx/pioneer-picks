package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.reviews.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Review> findByProfessorIdAndCourseId(UUID professorId, UUID courseId);

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.professor.id = :professorId AND c.course.id = :courseId")
    long countByProfessorAndCourse(@Param("professorId") UUID professorId, @Param("courseId") UUID courseId);

}
