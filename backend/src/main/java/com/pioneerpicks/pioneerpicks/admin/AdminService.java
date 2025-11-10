package com.pioneerpicks.pioneerpicks.admin;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseAdminDto;
import com.pioneerpicks.pioneerpicks.courses.dto.NewCourseDto;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.professors.dto.NewProfessorDto;
import com.pioneerpicks.pioneerpicks.subjects.Subject;
import com.pioneerpicks.pioneerpicks.subjects.SubjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AdminService {

    private final CourseRepository courseRepository;
    private final SubjectRepository subjectRepository;
    private final ProfessorRepository professorRepository;

    public AdminService(
            CourseRepository courseRepository,
            SubjectRepository subjectRepository,
            ProfessorRepository professorRepository
    ) {
        this.courseRepository = courseRepository;
        this.subjectRepository = subjectRepository;
        this.professorRepository = professorRepository;
    }

    @Value("${admin.key}")
    private String adminKey;

    // the thing is, you have to add everything, including abbreviation and areas
    // We CAN hit approve simply but those fields will be empty until we manually update them
    // another issue is users will definitely not use 100% proper grammar, but the point of the approval is to just know what courses users want

    public ResponseEntity<?> approveCourse(String apiKey, NewCourseAdminDto newCourseAdminDto) {
        if (!apiKey.equals(adminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        System.out.println("Proposed course name on approve course receive: " + newCourseAdminDto.name());
        Subject subject = subjectRepository.findById(newCourseAdminDto.subjectId()).orElseThrow(() -> new RuntimeException("Subject not found"));
        Course course = new Course(newCourseAdminDto.name(), subject);

        courseRepository.save(course);

        return ResponseEntity.ok(Map.of("status", "approved"));
    }

    public ResponseEntity<?> approveProfessor(String apiKey, NewProfessorDto newProfessorDto) {
        if (!apiKey.equals(adminKey)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Course course = courseRepository.findById(newProfessorDto.courseId()).orElseThrow(() -> new RuntimeException(("Course not found")));
        Professor professor = new Professor(newProfessorDto.name());

        System.out.println("Proposed professor name on approve professor receive: " + newProfessorDto.name());

        professorRepository.save(professor); // auto generates id

        course.getProfessors().add(professor);
        professor.getCourses().add(course);

        courseRepository.save(course);

        return ResponseEntity.ok(Map.of("status", "approved"));
    }
}
