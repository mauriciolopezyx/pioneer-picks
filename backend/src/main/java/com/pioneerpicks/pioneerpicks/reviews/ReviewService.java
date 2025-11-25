package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.exception.ForbiddenException;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.reviews.dto.FullReviewDto;
import com.pioneerpicks.pioneerpicks.reviews.dto.PostReviewDto;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ProfessorRepository professorRepository;
    private final CourseRepository courseRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ProfessorRepository professorRepository,
            CourseRepository courseRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.professorRepository = professorRepository;
        this.courseRepository = courseRepository;
    }

    public ResponseEntity<Void> postCourseProfessorReview(UUID courseId, UUID professorId, PostReviewDto postReviewDto) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException("Course not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Optional<Review> reviewThatShouldNotExist = reviewRepository.findByAllIds(user.getId(), professorId, courseId);
        if (reviewThatShouldNotExist.isPresent()) {
            throw new ForbiddenException("You have already posted a review");
        }

        System.out.println("processing new post review request (ReviewService)");

        Review review;
        if (postReviewDto.textbook().isPresent()) {
            review = new Review(
                    professor,
                    course,
                    user,
                    LocalDate.now(),
                    postReviewDto.semester(),
                    postReviewDto.location(),
                    postReviewDto.workload(),
                    postReviewDto.leniency(),
                    postReviewDto.communication(),
                    postReviewDto.assignments(),
                    postReviewDto.curve(),
                    postReviewDto.attendance(),
                    postReviewDto.late(),
                    postReviewDto.textbook().get(),
                    postReviewDto.positive(),
                    postReviewDto.negative()
            );
        } else {
            review = new Review(
                    professor,
                    course,
                    user,
                    LocalDate.now(),
                    postReviewDto.semester(),
                    postReviewDto.location(),
                    postReviewDto.workload(),
                    postReviewDto.leniency(),
                    postReviewDto.communication(),
                    postReviewDto.assignments(),
                    postReviewDto.curve(),
                    postReviewDto.attendance(),
                    postReviewDto.late(),
                    postReviewDto.positive(),
                    postReviewDto.negative()
            );
        }
        reviewRepository.save(review);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Map<String, Object>> getCourseProfessorReviews(UUID courseId, UUID professorId, Integer pageNumber) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException("Course not found"));
        Pageable pageable = PageRequest.of(pageNumber, 5);

        Page<Review> page = reviewRepository.findReviewsWithUserAndCourse(professorId, courseId, pageable);

        List<FullReviewDto> reviews = page.getContent().stream()
                .map(review -> new FullReviewDto(review.getId(), review.getUser().getUsername(), review.getDate(), review.getSemester(), review.getLocation(), review.getWorkload(), review.getLeniency(), review.getAssignments(), review.getCommunication(), review.getCurve(), review.getAttendance(), review.getLate(), Optional.ofNullable(review.getTextbook()), review.getPositive(), review.getNegative()))
                .toList();

        return ResponseEntity.ok(Map.of("content", reviews, "hasMore", page.hasNext(), "totalElements", page.getTotalElements(), "totalPages", page.getTotalPages(), "currentPage", page.getNumber()));
    }

}
