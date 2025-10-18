package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.professors.ProfessorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping("/")
    public ResponseEntity<?> getCoursesBySubject(
            @RequestParam UUID subjectId
    ) {
        return courseService.getCoursesBySubject(subjectId);
    }


}
