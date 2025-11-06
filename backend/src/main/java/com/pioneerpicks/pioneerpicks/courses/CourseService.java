package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import com.pioneerpicks.pioneerpicks.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public CourseService(
            CourseRepository courseRepository,
            ReviewRepository reviewRepository,
            CommentRepository commentRepository,
            UserRepository userRepository
    ) {
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
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

        boolean favorited = userRepository.isCourseFavoritedByUser(user.getId(), id);

        FullCourseDto dto = new FullCourseDto(id, course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas(), professorDtos, favorited);
        return ResponseEntity.ok().body(dto);
    }

    public ResponseEntity<?> requestNewCourse(@Valid NewCourseDto newCourseDto) {

    }
}
