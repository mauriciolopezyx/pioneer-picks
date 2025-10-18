package com.pioneerpicks.pioneerpicks.professors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/course")
    public ResponseEntity<?> getProfessorsByCourse(
            @RequestParam UUID courseId
    ) {
        return professorService.getProfessorsByCourse(courseId);
    }

}
