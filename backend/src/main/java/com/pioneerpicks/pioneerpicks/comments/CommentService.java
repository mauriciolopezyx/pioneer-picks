package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.comments.dto.FullCommentDto;
import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
class CommentService {

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

    public ResponseEntity<Void> postCourseProfessorComment(UUID courseId, UUID professorId, PostCommentDto postCommentDto) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException("Course not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Comment comment = new Comment(professor, course, user, LocalDate.now(), postCommentDto.body());
        commentRepository.save(comment);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Map<String, Object>> getComments(UUID courseId, UUID professorId, Integer pageNumber) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException("Course not found"));
        Pageable pageable = PageRequest.of(pageNumber, 20);

        Page<Comment> page = commentRepository.findCommentsWithUserAndCourse(professorId, courseId, pageable);

        List<FullCommentDto> comments = page.getContent().stream()
                .map(comment -> new FullCommentDto(comment.getId(), comment.getUser().getUsername(), comment.getDate(), comment.getBody()))
                .toList();

        return ResponseEntity.ok(Map.of("content", comments, "hasMore", page.hasNext(), "totalElements", page.getTotalElements(), "totalPages", page.getTotalPages(), "currentPage", page.getNumber()));
    }

}
