package com.pioneerpicks.pioneerpicks.reviews;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/")
    public ResponseEntity<?> getReviews(
            @RequestParam UUID professorId,
            @RequestParam UUID courseId
    ) {
        return reviewService.getReviews(professorId, courseId);
    }


}
