package com.pioneerpicks.pioneerpicks.courses;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(
            CourseRepository courseRepository
    ) {
        this.courseRepository = courseRepository;
    }

    public ResponseEntity<?> getCoursesBySubject(UUID subjectId) {
        return ResponseEntity.ok().body(Map.of("courses", courseRepository.findBySubjectId(subjectId)));
    }

}
