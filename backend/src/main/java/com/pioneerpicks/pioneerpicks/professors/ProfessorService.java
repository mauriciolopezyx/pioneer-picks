package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.exception.InternalServerErrorException;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import com.pioneerpicks.pioneerpicks.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final RestTemplate restTemplate;

    @Value("${discord.bot.url}")
    private String discordBotUrl;

    @Value("${discord.secret}")
    private String discordSecret;

    public ProfessorService(
            ProfessorRepository professorRepository,
            ReviewRepository reviewRepository,
            CommentRepository commentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            RestTemplateBuilder builder
    ) {
        this.professorRepository = professorRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.restTemplate = builder.build();
        this.courseRepository = courseRepository;
    }

    public ResponseEntity<Map<Object, Object>> getProfessorInformation(UUID professorId) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        boolean favorited = userRepository.isProfessorFavoritedByUser(user.getId(), professorId);

        return ResponseEntity.ok(Map.of("favorited", favorited, "info", Map.of("name", professor.getName())));
    }

    public ResponseEntity<Map<String, Object>> getProfessorCourses(UUID id, Integer pageNumber) {
        Professor professor = professorRepository.findById(id).orElseThrow(() -> new NotFoundException("Professor not found"));
        Pageable pageable = PageRequest.of(pageNumber, 20);

        Page<Course> page = professorRepository.findCourses(id, pageable);

        List<FavoriteCourseDto> courses = page.getContent().stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        return ResponseEntity.ok(Map.of("content", courses, "hasMore", page.hasNext(), "totalElements", page.getTotalElements(), "totalPages", page.getTotalPages(), "currentPage", page.getNumber()));
    }

    public ResponseEntity<BasicProfessorDto> getProfessorCourseInformation(UUID courseId, UUID professorId) {
        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));

        long reviewCount = reviewRepository.countByProfessorAndCourse(professorId, courseId);
        long commentCount = commentRepository.countByProfessorAndCourse(professorId, courseId);

        BasicProfessorDto dto = new BasicProfessorDto(professorId, professor.getName(), reviewCount, commentCount);
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<Void> requestNewProfessor(@Valid NewProfessorDto newProfessorDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Course course = courseRepository.findById(newProfessorDto.courseId()).orElseThrow(() -> new NotFoundException("Course not found"));

        Map<String, Object> payload = Map.of(
                "secret", discordSecret,
                "courseName", course.getName(),
                "courseId", newProfessorDto.courseId(),
                "name", newProfessorDto.name(),
                "userId", user.getId()
        );

        try {
            restTemplate.postForEntity(discordBotUrl + "/notify-professor", payload, String.class);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to notify Discord bot");
        }

        return ResponseEntity.noContent().build();
    }

}
