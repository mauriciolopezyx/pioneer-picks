package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.subjects.dto.SubjectDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(
            SubjectRepository subjectRepository
    ) {
        this.subjectRepository = subjectRepository;
    }

    public ResponseEntity<?> getAllSubjects() {
        List<SubjectDto> subjectDTOs = subjectRepository.findAll().stream()
                .map(subject -> new SubjectDto(subject.getId(), subject.getName(), subject.getAbbreviation(), subject.getDescription()))
                .toList();
        return ResponseEntity.ok().body(Map.of("subjects", subjectDTOs));
    }

}
