package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.courses.dto.BasicCourseDto;
import com.pioneerpicks.pioneerpicks.subjects.dto.SubjectDiscoverDto;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(
            SubjectRepository subjectRepository
    ) {
        this.subjectRepository = subjectRepository;
    }

    public ResponseEntity<?> getAllSubjects() {
        List<SubjectDiscoverDto> subjectDtos = subjectRepository.findAll().stream()
                .map(subject -> new SubjectDiscoverDto(subject.getId(), subject.getName(), subject.getAbbreviation(), subject.getDescription()))
                .toList();
        return ResponseEntity.ok().body(Map.of("subjects", subjectDtos));
    }

    public ResponseEntity<?> getSubjectInformation(UUID id) {
        Optional<Subject> subject = subjectRepository.findById(id);
        System.out.println("received subject id query:" + id);
        if (subject.isEmpty()) {
            throw new RuntimeException("Subject not found");
        }

        List<BasicCourseDto> courseDtos = subject.get().getCourses().stream()
                .map(course -> new BasicCourseDto(course.getId(), course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas()))
                .toList();
        FullSubjectDto dto = new FullSubjectDto(id, subject.get().getName(), subject.get().getAbbreviation(), subject.get().getDescription(), courseDtos);
        return ResponseEntity.ok().body(dto);
    }

}
