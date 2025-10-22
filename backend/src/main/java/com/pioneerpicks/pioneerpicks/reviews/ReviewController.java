package com.pioneerpicks.pioneerpicks.reviews;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getCourseProfessorReviews(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec course professor reviews attempt");
        return reviewService.getCourseProfessorReviews(courseId, professorId);
    }


}
