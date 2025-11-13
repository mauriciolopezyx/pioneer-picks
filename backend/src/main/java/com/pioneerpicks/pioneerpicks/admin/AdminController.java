package com.pioneerpicks.pioneerpicks.admin;

import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseAdminDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/admin")
@RestController
class AdminController {

    private final AdminService adminService;

    public AdminController(
            AdminService adminService
    ) {
        this.adminService = adminService;
    }

    @PostMapping("/approve-course")
    public ResponseEntity<Void> approveCourse(
            @RequestHeader("x-api-key") String apiKey,
            @RequestBody NewCourseAdminDto newCourseAdminDto
    ) {
        return adminService.approveCourse(apiKey, newCourseAdminDto);
    }

    @PostMapping("/approve-professor")
    public ResponseEntity<Void> approveProfessor(
            @RequestHeader("x-api-key") String apiKey,
            @RequestBody NewProfessorDto newProfessorDto
    ) {
        return adminService.approveProfessor(apiKey, newProfessorDto);
    }

}
