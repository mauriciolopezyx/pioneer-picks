package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(String q1, String q2);
    List<Course> findBySubjectId(UUID subjectId);

}
