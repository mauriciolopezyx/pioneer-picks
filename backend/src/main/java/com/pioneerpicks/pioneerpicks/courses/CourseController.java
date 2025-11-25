package com.pioneerpicks.pioneerpicks.courses;

import com.pioneerpicks.pioneerpicks.courses.dto.FullCourseDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import com.pioneerpicks.pioneerpicks.favorites.dto.FavoriteCourseDto;
import com.pioneerpicks.pioneerpicks.professors.ProfessorService;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/courses")
class CourseController {

    private final CourseService courseService;

    public CourseController(
            CourseService courseService
    ) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCoursesByArea(
            @RequestParam(required = true) String q,
            @RequestParam(defaultValue = "0") int page
    ) {
        return courseService.getCoursesByArea(q, page);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FullCourseDto> getCourseInformation(
            @PathVariable UUID id
    ) {
        System.out.println("rec course information attempt");
        return courseService.getCourseInformation(id);
    }

    @GetMapping("/{id}/professors")
    public ResponseEntity<Map<String, Object>> getCourseProfessors(
            @PathVariable UUID id,
            @RequestParam(defaultValue = "0") int page
    ) {
        return courseService.getCourseProfessors(id, page);
    }

    @PostMapping
    public ResponseEntity<Void> requestNewCourse(
            @RequestBody @Valid NewCourseDto newCourseDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("New course request validation failed");
        }
        return courseService.requestNewCourse(newCourseDto);
    }

}
