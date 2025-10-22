package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import org.springframework.http.ResponseEntity;
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
        Optional<Course> course = courseRepository.findById(id);
        if (course.isEmpty()) {
            throw new RuntimeException("Course not found");
        }

        List<BasicProfessorDto> professorDtos = course.get().getProfessors().stream()
                .map(professor -> {
                    long reviewCount = reviewRepository.countByProfessorAndCourse(professor.getId(), id);
                    long commentCount = commentRepository.countByProfessorAndCourse(professor.getId(), id);
                    return new BasicProfessorDto(professor.getId(), professor.getName(), reviewCount, commentCount);
                })
                .toList();
        FullCourseDto dto = new FullCourseDto(id, course.get().getName(), course.get().getAbbreviation(), course.get().getUnits(), course.get().getAreas(), professorDtos);
        return ResponseEntity.ok().body(dto);
    }

}
