package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

        List<BasicProfessorDto> professorDtos = course.getProfessors().stream()
                .map(professor -> {
                    long reviewCount = reviewRepository.countByProfessorAndCourse(professor.getId(), id);
                    long commentCount = commentRepository.countByProfessorAndCourse(professor.getId(), id);
                    return new BasicProfessorDto(professor.getId(), professor.getName(), reviewCount, commentCount);
                })
                .toList();
        FullCourseDto dto = new FullCourseDto(id, course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas(), professorDtos, user.getFavoriteCourses().contains(course));
        return ResponseEntity.ok().body(dto);
    }

}
