package com.pioneerpicks.pioneerpicks.professors;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;

    public ProfessorService(
            ProfessorRepository professorRepository
    ) {
        this.professorRepository = professorRepository;
    }

    public ResponseEntity<?> getProfessorsByCourse(UUID courseId) {
        return ResponseEntity.ok().body(Map.of("professors", professorRepository.findByCourseId(courseId)));
    }

}
