package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/professors")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(
            ProfessorService professorService
    ) {
        this.professorService = professorService;
    }

    @GetMapping("/{professorId}/courses")
    public ResponseEntity<?> getProfessorCourseInformation(
            @PathVariable UUID professorId
    ) {
        try {
            return professorService.getProfessorCourses(professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getProfessorCourseInformation(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec professor course information attempt");
        try {
            return professorService.getProfessorCourseInformation(courseId, professorId);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> requestNewProfessor(@RequestBody @Valid NewProfessorDto newProfessorDto) {
        try {
            return professorService.requestNewProfessor(newProfessorDto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
