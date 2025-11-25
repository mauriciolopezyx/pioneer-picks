package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.comments.dto.FullCommentDto;
import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.CourseService;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/comments")
class CommentController {

    private final CommentService commentService;

    public CommentController(
            CommentService commentService
    ) {
        this.commentService = commentService;
    }

    @PostMapping("/{courseId}/{professorId}")
    public ResponseEntity<Void> postCourseProfessorComment(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId,
            @RequestBody @Valid PostCommentDto postCommentDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("POST comment validation failed");
        }
        System.out.println("rec POST course professor comments attempt");
        return commentService.postCourseProfessorComment(courseId, professorId, postCommentDto);
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<Map<String, Object>> getComments(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId,
            @RequestParam(defaultValue = "0") int page
    ) {
        System.out.println("rec course professor comments attempt");
        return commentService.getComments(courseId, professorId, page);
    }

}
