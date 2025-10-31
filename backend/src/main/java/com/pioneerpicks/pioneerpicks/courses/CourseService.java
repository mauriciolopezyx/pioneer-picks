package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    public CourseService(
            CourseRepository courseRepository,
            ReviewRepository reviewRepository,
            CommentRepository commentRepository
    ) {
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
    }

    public ResponseEntity<?> getCourseInformation(UUID id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new RuntimeException("Course not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<UUID, Long> reviewCounts = reviewRepository
                .countReviewsGroupedByProfessor(id)
                .stream()
                .collect(Collectors.toMap(ProfessorReviewCountDto::getProfessorId, ProfessorReviewCountDto::getReviewCount));

        Map<UUID, Long> commentCounts = commentRepository
                .countCommentsGroupedByProfessor(id)
                .stream()
                .collect(Collectors.toMap(ProfessorCommentCountDto::getProfessorId, ProfessorCommentCountDto::getCommentCount));

        List<BasicProfessorDto> professorDtos = course.getProfessors().stream()
                .map(professor -> new BasicProfessorDto(professor.getId(), professor.getName(), reviewCounts.getOrDefault(professor.getId(), 0L), commentCounts.getOrDefault(professor.getId(), 0L)))
                .toList();
        FullCourseDto dto = new FullCourseDto(id, course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas(), professorDtos, user.getFavoriteCourses().contains(course));
        return ResponseEntity.ok().body(dto);
    }

}
