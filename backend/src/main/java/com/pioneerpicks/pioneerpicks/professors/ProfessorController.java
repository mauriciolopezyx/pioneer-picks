package com.pioneerpicks.pioneerpicks.professors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<?> getProfessorCourseInformation(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec professor course information attempt");
        return professorService.getProfessorCourseInformation(courseId, professorId);
    }

}
