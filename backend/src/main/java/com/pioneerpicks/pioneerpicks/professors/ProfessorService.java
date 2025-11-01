package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import com.pioneerpicks.pioneerpicks.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    public ProfessorService(
            ProfessorRepository professorRepository,
            ReviewRepository reviewRepository,
            CommentRepository commentRepository,
            UserRepository userRepository
    ) {
        this.professorRepository = professorRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> getProfessorCourses(UUID professorId) {
        Professor professor = professorRepository.findProfessorWithCoursesAndSubjects(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));

        // FavoriteCourseDto basically gives us all information that we want for a specific course (from all courses of a professor), so I'm using that
        List<FavoriteCourseDto> courses = professor.getCourses().stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        boolean favorited = userRepository.isProfessorFavoritedByUser(user.getId(), professorId);

        return ResponseEntity.ok().body(Map.of("courses", courses, "favorited", favorited, "info", Map.of("name", professor.getName())));
    }

    public ResponseEntity<?> getProfessorCourseInformation(UUID courseId, UUID professorId) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));

        long reviewCount = reviewRepository.countByProfessorAndCourse(professorId, courseId);
        long commentCount = commentRepository.countByProfessorAndCourse(professorId, courseId);

        BasicProfessorDto dto = new BasicProfessorDto(professorId, professor.getName(), reviewCount, commentCount);
        return ResponseEntity.ok().body(dto);
    }

}
