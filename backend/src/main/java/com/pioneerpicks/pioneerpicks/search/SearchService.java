package com.pioneerpicks.pioneerpicks.search;

import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.search.dto.CourseSearchResultDto;
import com.pioneerpicks.pioneerpicks.search.dto.ProfessorSearchResultDto;
import com.pioneerpicks.pioneerpicks.search.dto.SubjectSearchResultDto;
import com.pioneerpicks.pioneerpicks.subjects.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
class SearchService {

    private final SubjectRepository subjectRepository;
    private final CourseRepository courseRepository;
    private final ProfessorRepository professorRepository;

    public SearchService(
            SubjectRepository subjectRepository,
            CourseRepository courseRepository,
            ProfessorRepository professorRepository

    ) {
        this.subjectRepository = subjectRepository;
        this.courseRepository = courseRepository;
        this.professorRepository = professorRepository;
    }

    public ResponseEntity<Map<Object, Object>> getSearchResults(String query) {
        List<SubjectSearchResultDto> subjects = subjectRepository.findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(query, query).stream()
                .map(subject -> new SubjectSearchResultDto(subject.getId(), subject.getName(), subject.getAbbreviation()))
                .toList();

        List<CourseSearchResultDto> courses = courseRepository.findCoursesWithSubject(query).stream()
                .map(course -> new CourseSearchResultDto( course.getId(), course.getName(), course.getAbbreviation(), course.getSubject().getName(), course.getSubject().getAbbreviation()))
                .toList();

        List<ProfessorSearchResultDto> professors = professorRepository.findByNameContainingIgnoreCase(query).stream()
                .map(professor -> new ProfessorSearchResultDto(professor.getId(), professor.getName()))
                .toList();

        return ResponseEntity.ok(Map.of("subjects", subjects, "courses", courses, "professors", professors));
    }

}
