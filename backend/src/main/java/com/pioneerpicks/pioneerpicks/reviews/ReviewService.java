package com.pioneerpicks.pioneerpicks.reviews;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    public ReviewService(
            ReviewRepository reviewRepository
    ) {
        this.reviewRepository = reviewRepository;
    }

    public ResponseEntity<?> getReviews(UUID professorId, UUID courseId) {
        return ResponseEntity.ok().body(Map.of("reviews", reviewRepository.findByProfessorIdAndCourseId(professorId, courseId)));
    }

}
