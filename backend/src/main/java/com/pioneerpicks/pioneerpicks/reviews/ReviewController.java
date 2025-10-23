package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.reviews.dto.PostReviewDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> postCourseProfessorReview(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId,
            @RequestBody @Valid PostReviewDto postReviewDto
    ) {
        System.out.println("rec POST course professor review attempt");
        try {
            return reviewService.postCourseProfessorReview(courseId, professorId, postReviewDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getCourseProfessorReviews(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec course professor reviews attempt");
        try {
            return reviewService.getCourseProfessorReviews(courseId, professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}
