package com.pioneerpicks.pioneerpicks.favorites;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(
            FavoriteService favoriteService
    ) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/courses")
    public ResponseEntity<?> getCourseFavorites() {
        return favoriteService.getCourseFavorites();
    }

    @GetMapping("/professors")
    public ResponseEntity<?> getProfessorFavorites() {
        return favoriteService.getProfessorFavorites();
    }

    @GetMapping()
    public ResponseEntity<?> getUserFavorites() {
        return favoriteService.getFavorites();
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<?> addCourseToFavorites(
            @PathVariable UUID courseId
    ) {
        try {
            return favoriteService.addCourseToFavorites(courseId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/professor/{professorId}")
    public ResponseEntity<?> addProfessorToFavorites(
            @PathVariable UUID professorId
    ) {
        try {
            return favoriteService.addProfessorToFavorites(professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/course/{courseId}")
    public ResponseEntity<?> removeCourseFromFavorites(
            @PathVariable UUID courseId
    ) {
        try {
            return favoriteService.removeCourseFromFavorites(courseId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/professor/{professorId}")
    public ResponseEntity<?> removeProfessorFromFavorites(
            @PathVariable UUID professorId
    ) {
        try {
            return favoriteService.removeProfessorFromFavorites(professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
