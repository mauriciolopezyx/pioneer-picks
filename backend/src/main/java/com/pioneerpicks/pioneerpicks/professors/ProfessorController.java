package com.pioneerpicks.pioneerpicks.professors;

import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/professors")
class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(
            ProfessorService professorService
    ) {
        this.professorService = professorService;
    }

    @GetMapping("/{professorId}")
    public ResponseEntity<Map<Object, Object>> getProfessorCourseInformation(
            @PathVariable UUID professorId
    ) {
        return professorService.getProfessorInformation(professorId);
    }

    @GetMapping("/{professorId}/courses")
    public ResponseEntity<Map<String, Object>> getProfessorCourses(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page
    ) {
        return professorService.getProfessorCourses(id, page);
    }

    @GetMapping("/{courseId}/{professorId}")
    public ResponseEntity<BasicProfessorDto> getProfessorCourseInformation(
            @PathVariable UUID courseId,
            @PathVariable UUID professorId
    ) {
        System.out.println("rec professor course information attempt");
        return professorService.getProfessorCourseInformation(courseId, professorId);
    }

    @PostMapping
    public ResponseEntity<Void> requestNewProfessor(
            @RequestBody @Valid NewProfessorDto newProfessorDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("New professor request validation failed");
        }
        return professorService.requestNewProfessor(newProfessorDto);
    }

}
