package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import com.pioneerpicks.pioneerpicks.reviews.dto.FullReviewDto;
import com.pioneerpicks.pioneerpicks.reviews.dto.PostReviewDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/reviews")
class ReviewController {
    private final ReviewService reviewService;

    public ReviewController(
            ReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }

    @PostMapping("/{courseId}/{professorId}")
    public ResponseEntity<Void> postCourseProfessorReview(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId,
            @RequestBody @Valid PostReviewDto postReviewDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("POST review validation failed");
        }
        System.out.println("rec POST course professor review attempt");
        return reviewService.postCourseProfessorReview(courseId, professorId, postReviewDto);
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<List<FullReviewDto>> getCourseProfessorReviews(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec course professor reviews attempt");
        return reviewService.getCourseProfessorReviews(courseId, professorId);
    }


}
