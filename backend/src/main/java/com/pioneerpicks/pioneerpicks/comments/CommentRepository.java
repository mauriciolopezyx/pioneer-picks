package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.reviews.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    List<Review> findByProfessorIdAndCourseId(UUID professorId, UUID courseId);
}
