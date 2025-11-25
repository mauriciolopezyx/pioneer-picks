package com.pioneerpicks.pioneerpicks.subjects;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.courses.dto.BasicCourseDto;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.subjects.dto.SubjectDiscoverDto;
import com.pioneerpicks.pioneerpicks.subjects.dto.FullSubjectDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

        FullSubjectDto dto = new FullSubjectDto(id, subject.getName(), subject.getAbbreviation(), subject.getDescription());
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<Map<String, Object>> getSubjectCourses(UUID id, Integer pageNumber) {
        Subject subject = subjectRepository.findById(id).orElseThrow(() -> new NotFoundException("Subject not found"));
        Pageable pageable = PageRequest.of(pageNumber, 20);

        Page<Course> page = subjectRepository.findCourses(id, pageable);

        List<BasicCourseDto> courses = page.getContent().stream()
                .map(course -> new BasicCourseDto(course.getId(), course.getName(), course.getAbbreviation(), course.getUnits(), course.getAreas()))
                .toList();

        return ResponseEntity.ok(Map.of("content", courses, "hasMore", page.hasNext(), "totalElements", page.getTotalElements(), "totalPages", page.getTotalPages(), "currentPage", page.getNumber()));
    }

}
