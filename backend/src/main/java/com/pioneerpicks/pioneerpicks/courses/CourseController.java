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
    public ResponseEntity<List<FavoriteCourseDto>> getCoursesByArea(
            @RequestParam(required = true) String q
    ) {
        return courseService.getCoursesByArea(q);
    }

    @GetMapping("/{id}")
    public ResponseEntity<FullCourseDto> getCourseInformation(
            @PathVariable UUID id
    ) {
        System.out.println("rec course information attempt");
        return courseService.getCourseInformation(id);
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
