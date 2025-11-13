package com.pioneerpicks.pioneerpicks.favorites;

import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteProfessorDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/favorites")
class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(
            FavoriteService favoriteService
    ) {
        this.favoriteService = favoriteService;
    }

    @GetMapping("/courses")
    public ResponseEntity<List<FavoriteCourseDto>> getCourseFavorites() {
        return favoriteService.getCourseFavorites();
    }

    @GetMapping("/professors")
    public ResponseEntity<List<FavoriteProfessorDto>> getProfessorFavorites() {
        return favoriteService.getProfessorFavorites();
    }

    @GetMapping
    public ResponseEntity<Map<Object, Object>> getUserFavorites() {
        return favoriteService.getFavorites();
    }

    @PostMapping("/course/{courseId}")
    public ResponseEntity<Void> addCourseToFavorites(
            @PathVariable UUID courseId
    ) {
        return favoriteService.addCourseToFavorites(courseId);
    }

    @PostMapping("/professor/{professorId}")
    public ResponseEntity<Void> addProfessorToFavorites(
            @PathVariable UUID professorId
    ) {
        return favoriteService.addProfessorToFavorites(professorId);
    }

    @DeleteMapping("/course/{courseId}")
    public ResponseEntity<Void> removeCourseFromFavorites(
            @PathVariable UUID courseId
    ) {
        return favoriteService.removeCourseFromFavorites(courseId);
    }

    @DeleteMapping("/professor/{professorId}")
    public ResponseEntity<Void> removeProfessorFromFavorites(
            @PathVariable UUID professorId
    ) {
        return favoriteService.removeProfessorFromFavorites(professorId);
    }

}
