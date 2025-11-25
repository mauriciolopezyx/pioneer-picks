package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import com.pioneerpicks.pioneerpicks.subjects.dto.SubjectDiscoverDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/subjects")
class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService
    ) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectDiscoverDto>> getAllSubjects() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/{id}")
    public ResponseEntity<FullSubjectDto> getSubjectInformation(
            @PathVariable UUID id
    ) {
        System.out.println("rec subject information attempt");
        return subjectService.getSubjectInformation(id);
    }

    @GetMapping("/{id}/courses")
    public ResponseEntity<Map<String, Object>> getSubjectCourses(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page
    ) {
        return subjectService.getSubjectCourses(id, page);
    }

}
