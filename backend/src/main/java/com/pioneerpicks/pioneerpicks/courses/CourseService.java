package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.comments.CommentRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.exception.InternalServerErrorException;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorCommentCountDto;
import com.pioneerpicks.pioneerpicks.professors.dto.ProfessorReviewCountDto;
import com.pioneerpicks.pioneerpicks.reviews.ReviewRepository;
import com.pioneerpicks.pioneerpicks.subjects.Subject;
import com.pioneerpicks.pioneerpicks.subjects.SubjectRepository;
import com.pioneerpicks.pioneerpicks.user.User;
import com.pioneerpicks.pioneerpicks.user.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
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
public class CourseService {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final RestTemplate restTemplate;

    // TODO: use ConfigurationProperties as a class and inject it via constructor

    @Value("${discord.bot.url}")
    private String discordBotUrl;

    @Value("${discord.secret}")
    private String discordSecret;

    public CourseService(
            CourseRepository courseRepository,
            ReviewRepository reviewRepository,
            CommentRepository commentRepository,
            UserRepository userRepository,
            SubjectRepository subjectRepository,
            RestTemplateBuilder builder
    ) {
        this.courseRepository = courseRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.restTemplate = builder.build();
    }

    public ResponseEntity<List<FavoriteCourseDto>> getCoursesByArea(String q) {
        List<Course> matchingCourses = courseRepository.findCoursesByArea(q);

        List<FavoriteCourseDto> courses = matchingCourses.stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        return ResponseEntity.ok(courses);
    }

    public ResponseEntity<FullCourseDto> getCourseInformation(UUID id) {
        Course course = courseRepository.findById(id).orElseThrow(() -> new NotFoundException("Course not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<UUID, Long> reviewCounts = reviewRepository
                .countReviewsGroupedByProfessor(id)
                .stream()
                .collect(Collectors.toMap(ProfessorReviewCountDto::getProfessorId, ProfessorReviewCountDto::getReviewCount));

        Map<UUID, Long> commentCounts = commentRepository
                .countCommentsGroupedByProfessor(id)
                .stream()
                .collect(Collectors.toMap(ProfessorCommentCountDto::getProfessorId, ProfessorCommentCountDto::getCommentCount));

        List<BasicProfessorDto> professorDtos = course.getProfessors().stream()
                .map(professor -> new BasicProfessorDto(professor.getId(), professor.getName(), reviewCounts.getOrDefault(professor.getId(), 0L), commentCounts.getOrDefault(professor.getId(), 0L)))
                .toList();

        boolean favorited = userRepository.isCourseFavoritedByUser(user.getId(), id);

        FullCourseDto dto = new FullCourseDto(id, course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas(), professorDtos, favorited);
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<Void> requestNewCourse(@Valid NewCourseDto newCourseDto) {
        Subject subject = subjectRepository.findByNameContainingIgnoreCase(newCourseDto.subject()).orElseThrow(() -> new NotFoundException("Subject not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Map<String, Object> payload = Map.of(
                "secret", discordSecret,
                "subjectName", newCourseDto.subject(),
                "subjectId", subject.getId(),
                "name", newCourseDto.name(),
                "userId", user.getId()
        );

        try {
            restTemplate.postForEntity(discordBotUrl + "/notify-course", payload, String.class);
        } catch (Exception e) {
            throw new InternalServerErrorException("Failed to notify Discord bot");
        }

        return ResponseEntity.noContent().build();
    }
}
