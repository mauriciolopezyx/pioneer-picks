package com.pioneerpicks.pioneerpicks.favorites;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
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
class FavoriteService {

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

    public ResponseEntity<Void> addCourseToFavorites(UUID courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Course course = courseRepository.findById(courseId).orElseThrow(() -> new NotFoundException("Course not found"));

        User userWithFavorites = userRepository.findUserWithFavoriteCoursesAndSubjects(user.getId()).orElseThrow(); // should never throw

        if (!userWithFavorites.getFavoriteCourses().contains(course)) {
            userWithFavorites.getFavoriteCourses().add(course);
            userRepository.save(userWithFavorites);
        }

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> removeCourseFromFavorites(UUID courseId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteCoursesAndSubjects(user.getId()).orElseThrow(); // should never throw

        userWithFavorites.getFavoriteCourses().removeIf(c -> c.getId().equals(courseId));
        userRepository.save(userWithFavorites);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> addProfessorToFavorites(UUID professorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        Professor professor = professorRepository.findById(professorId).orElseThrow(() -> new NotFoundException("Professor not found"));
        User userWithFavorites = userRepository.findUserWithFavoriteProfessors(user.getId()).orElseThrow(); // should never throw

        if (!userWithFavorites.getFavoriteProfessors().contains(professor)) {
            userWithFavorites.getFavoriteProfessors().add(professor);
            userRepository.save(userWithFavorites);
        }

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Void> removeProfessorFromFavorites(UUID professorId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteProfessors(user.getId()).orElseThrow(); // should never throw

        userWithFavorites.getFavoriteProfessors().removeIf(p -> p.getId().equals(professorId));
        userRepository.save(userWithFavorites);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<FavoriteCourseDto>> getCourseFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteCoursesAndSubjects(user.getId()).orElseThrow(); // should never throw

        List<FavoriteCourseDto> courses = userWithFavorites.getFavoriteCourses().stream()
                .map(course -> new FavoriteCourseDto(course.getId(), course.getName(), course.getSubject().getName(), course.getAbbreviation(), course.getSubject().getAbbreviation()))
                .toList();

        return ResponseEntity.ok(courses);
    }

    public ResponseEntity<List<FavoriteProfessorDto>> getProfessorFavorites() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        User userWithFavorites = userRepository.findUserWithFavoriteProfessors(user.getId()).orElseThrow(); // should never throw

        List<FavoriteProfessorDto> professors = userWithFavorites.getFavoriteProfessors().stream()
                .map(professor -> new FavoriteProfessorDto(professor.getId(), professor.getName()))
                .toList();

        return ResponseEntity.ok(professors);
    }

    public ResponseEntity<Map<Object, Object>> getFavorites() {
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

        return ResponseEntity.ok(Map.of("professors", professors, "courses", courses));
    }


}
