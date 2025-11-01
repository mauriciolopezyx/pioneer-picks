package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.CourseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService
    ) {
        this.commentService = commentService;
    }

    @PostMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> postCourseProfessorComment(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId,
            @RequestBody @Valid PostCommentDto postCommentDto
            ) {
        System.out.println("rec POST course professor comments attempt");
        try {
            return commentService.postCourseProfessorComment(courseId, professorId, postCommentDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getComments(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec course professor comments attempt");
        try {
            return commentService.getComments(courseId, professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
