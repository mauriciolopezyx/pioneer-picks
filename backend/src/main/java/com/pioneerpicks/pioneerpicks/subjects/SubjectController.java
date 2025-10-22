package com.pioneerpicks.pioneerpicks.subjects;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService
    ) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<?> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubjectInformation(
            @PathVariable UUID id
    ) {
        System.out.println("rec subject information attempt");
        return subjectService.getSubjectInformation(id);
    }

}
