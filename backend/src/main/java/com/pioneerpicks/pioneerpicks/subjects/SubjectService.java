package com.pioneerpicks.pioneerpicks.subjects;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(
            SubjectRepository subjectRepository
    ) {
        this.subjectRepository = subjectRepository;
    }

    public ResponseEntity<?> getAllSubjects() {
        return ResponseEntity.ok().body(Map.of("subjects", subjectRepository.findAll()));
    }

}
