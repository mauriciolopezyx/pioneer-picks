package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.courses.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

//    @GetMapping
//    public ResponseEntity<?> getReviews(
//            @RequestParam UUID professorId,
//            @RequestParam UUID courseId
//    ) {
//        return commentService.getComments(professorId, courseId);
//    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getCourseProfessorComments(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec course professor comments attempt");
        return commentService.getCourseProfessorComments(courseId, professorId);
    }

}
