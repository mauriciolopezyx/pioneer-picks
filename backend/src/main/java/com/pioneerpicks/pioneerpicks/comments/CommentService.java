package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.comments.dto.FullCommentDto;
import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;

    public CommentService(
            CommentRepository commentRepository,
            ProfessorRepository professorRepository,
            CourseRepository courseRepository
    ) {
        this.commentRepository = commentRepository;
        this.professorRepository = professorRepository;
        this.courseRepository = courseRepository;
    }

    public ResponseEntity<?> getComments(UUID professorId, UUID courseId) {
        return ResponseEntity.ok().body(Map.of("comments", commentRepository.findCommentsWithUserAndCourse(professorId, courseId)));
    }

    public ResponseEntity<?> postCourseProfessorComment(UUID courseId, UUID professorId, PostCommentDto postCommentDto) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Comment comment = new Comment(professor, course, user, LocalDate.now(), postCommentDto.body());
        commentRepository.save(comment);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> getCourseProfessorComments(UUID courseId, UUID professorId) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        List<Comment> comments = commentRepository.findCommentsWithUserAndCourse(professorId, courseId);

        List<FullCommentDto> dtos = comments.stream()
                .map(comment -> new FullCommentDto(comment.getId(), comment.getUser().getUsername(), comment.getDate(), comment.getBody()))
                .toList();

        return ResponseEntity.ok().body(dtos);
    }

}
