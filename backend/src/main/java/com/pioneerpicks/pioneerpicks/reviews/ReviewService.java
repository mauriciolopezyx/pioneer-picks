package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.reviews.dto.FullReviewDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProfessorRepository professorRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProfessorRepository professorRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.professorRepository = professorRepository;
    }

    public ResponseEntity<?> getCourseProfessorReviews(UUID courseId, UUID professorId) {
        Optional<Professor> professor = professorRepository.findById(professorId);
        if (professor.isEmpty()) {
            throw new RuntimeException("Professor not found");
        }

        List<FullReviewDto> dtos = professor.get().getReviews().stream()
                .filter(review -> review.getCourse() != null && courseId.equals(review.getCourse().getId()))
                .map(review -> new FullReviewDto(review.getId(), review.getName(), review.getDate(), review.getSemester(), review.getLocation(), review.getWorkload(), review.getLeniency(), review.getAssignments(), review.getCommunication(), review.getCurve(), review.getAttendance(), review.getLate(), Optional.ofNullable(review.getTextbook()), review.getPositive(), review.getNegative()))
                .toList();

        return ResponseEntity.ok().body(dtos);
    }

}
