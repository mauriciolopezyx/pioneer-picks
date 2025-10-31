package com.pioneerpicks.pioneerpicks.favorites;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
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
public class FavoriteService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final ProfessorRepository professorRepository;

    public FavoriteService(
            UserRepository userRepository,
            CourseRepository courseRepository,
            ProfessorRepository professorRepository
    ) {
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.professorRepository = professorRepository;
    }

    public ResponseEntity<?> addCourseToFavorites(UUID courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new RuntimeException("Course not found"));

        if (!user.getFavoriteCourses().contains(course)) {
            user.getFavoriteCourses().add(course);
            userRepository.save(user);
        }

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> removeCourseFromFavorites(UUID courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        user.getFavoriteCourses().removeIf(c -> c.getId().equals(courseId));
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> addProfessorToFavorites(UUID professorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new RuntimeException("Professor not found"));

        if (!user.getFavoriteProfessors().contains(professor)) {
            user.getFavoriteProfessors().add(professor);
            userRepository.save(user);
        }

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> removeProfessorFromFavorites(UUID professorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        user.getFavoriteProfessors().removeIf(p -> p.getId().equals(professorId));
        userRepository.save(user);

        return ResponseEntity.ok().build();
    }

    public ResponseEntity<?> getCourseFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteCoursesAndSubjects(user.getId()).orElseThrow(); // should never throw

        List<FavoriteCourseDto> courses = userWithFavorites.getFavoriteCourses().stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        return ResponseEntity.ok().body(courses);
    }

    public ResponseEntity<?> getProfessorFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteProfessors(user.getId()).orElseThrow(); // should never throw

        List<FavoriteProfessorDto> professors = userWithFavorites.getFavoriteProfessors().stream()
                .map(professor -> new FavoriteProfessorDto(professor.getId(), professor.getName()))
                .toList();

        return ResponseEntity.ok().body(professors);
    }

    public ResponseEntity<?> getFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites1 = userRepository.findUserWithFavoriteCoursesAndSubjects(user.getId()).orElseThrow(); // should never throw
        User userWithFavorites2 = userRepository.findUserWithFavoriteProfessors(user.getId()).orElseThrow(); // should never throw

        List<FavoriteCourseDto> courses = userWithFavorites1.getFavoriteCourses().stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        List<FavoriteProfessorDto> professors = userWithFavorites2.getFavoriteProfessors().stream()
                .map(professor -> new FavoriteProfessorDto(professor.getId(), professor.getName()))
                .toList();

        return ResponseEntity.ok().body(Map.of("professors", professors, "courses", courses));
    }


}
