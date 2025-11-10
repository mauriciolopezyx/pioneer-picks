package com.pioneerpicks.pioneerpicks.admin;

import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseAdminDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
public class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService
    ) {
        this.adminService = adminService;
    }

    @PostMapping("/approve-course")
    public ResponseEntity<?> approveCourse(
            @RequestHeader("x-api-key") String apiKey,
            @RequestBody NewCourseAdminDto newCourseAdminDto
    ) {
        try {
            return adminService.approveCourse(apiKey, newCourseAdminDto);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/approve-professor")
    public ResponseEntity<?> approveProfessor(
            @RequestHeader("x-api-key") String apiKey,
            @RequestBody NewProfessorDto newProfessorDto
    ) {
        try {
            return adminService.approveProfessor(apiKey, newProfessorDto);
        } catch (RuntimeException e) {
            System.out.println(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
