package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.professors.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(
            CourseService courseService
    ) {
        this.courseService = courseService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseInformation(
            @PathVariable UUID id
    ) {
        System.out.println("rec course information attempt");
        try {
            return courseService.getCourseInformation(id);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
