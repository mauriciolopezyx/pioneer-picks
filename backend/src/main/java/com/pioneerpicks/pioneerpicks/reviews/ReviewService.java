package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.comments.Comment;
import com.pioneerpicks.pioneerpicks.comments.dto.PostCommentDto;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.reviews.dto.FullReviewDto;
import com.pioneerpicks.pioneerpicks.reviews.dto.PostReviewDto;
import com.pioneerpicks.pioneerpicks.user.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ReviewService {
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

    public ResponseEntity<?> postCourseProfessorReview(UUID courseId, UUID professorId, PostReviewDto postReviewDto) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        System.out.println("processing post review request (ReviewService)");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

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

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> getCourseProfessorReviews(UUID courseId, UUID professorId) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        List<Review> reviews = reviewRepository.findReviewsWithUserAndCourse(professorId, courseId);

        List<FullReviewDto> dtos = reviews.stream()
                .map(review -> new FullReviewDto(review.getId(), review.getUser().getUsername(), review.getDate(), review.getSemester(), review.getLocation(), review.getWorkload(), review.getLeniency(), review.getAssignments(), review.getCommunication(), review.getCurve(), review.getAttendance(), review.getLate(), Optional.ofNullable(review.getTextbook()), review.getPositive(), review.getNegative()))
                .toList();

        return ResponseEntity.ok().body(dtos);
    }

}
