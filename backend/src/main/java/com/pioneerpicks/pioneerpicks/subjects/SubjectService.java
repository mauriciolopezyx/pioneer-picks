package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.courses.dto.BasicCourseDto;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.subjects.dto.SubjectDiscoverDto;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(
            SubjectRepository subjectRepository
    ) {
        this.subjectRepository = subjectRepository;
    }

    public ResponseEntity<List<SubjectDiscoverDto>> getAllSubjects() {
        List<SubjectDiscoverDto> subjectDtos = subjectRepository.findAll().stream()
                .map(subject -> new SubjectDiscoverDto(subject.getId(), subject.getName(), subject.getAbbreviation(), subject.getDescription()))
                .toList();
        return ResponseEntity.ok(subjectDtos);
    }

    public ResponseEntity<FullSubjectDto> getSubjectInformation(UUID id) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("Subject not found"));
        System.out.println("received subject id query:" + id);

        List<BasicCourseDto> courses = subject.getCourses().stream()
                .map(course -> new BasicCourseDto(course.getId(), course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas()))
                .toList();
        FullSubjectDto dto = new FullSubjectDto(id, subject.getName(), subject.getAbbreviation(), subject.getDescription(), courses);
        return ResponseEntity.ok(dto);
    }

}
