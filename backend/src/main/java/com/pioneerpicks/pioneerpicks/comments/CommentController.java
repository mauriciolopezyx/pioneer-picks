package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.courses.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping
    public ResponseEntity<?> getReviews(
            @RequestParam UUID professorId,
            @RequestParam UUID courseId
    ) {
        return commentService.getComments(professorId, courseId);
    }


}
