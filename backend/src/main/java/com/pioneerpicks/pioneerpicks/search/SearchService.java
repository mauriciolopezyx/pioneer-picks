package com.pioneerpicks.pioneerpicks.search;

import com.pioneerpicks.pioneerpicks.courses.CourseRepository;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import com.pioneerpicks.pioneerpicks.search.dto.SearchResultDto;
import com.pioneerpicks.pioneerpicks.subjects.SubjectRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SearchService {

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

    public ResponseEntity<?> getSearchResults(String query) {
        List<SearchResultDto> results = new ArrayList<>();
        subjectRepository.findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(query, query)
                .forEach(subject -> results.add(new SearchResultDto(subject.getId(), subject.getName(), Optional.ofNullable(subject.getAbbreviation()), Optional.empty(), 1)));
        courseRepository.findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(query, query)
                .forEach(course -> {
                    String subjectName = course.getSubject() != null
                            ? course.getSubject().getName()
                            : null;
                    results.add(new SearchResultDto(
                            course.getId(),
                            course.getName(),
                            Optional.ofNullable(course.getAbbreviation()),
                            Optional.ofNullable(subjectName),
                            2
                    ));
                });

        //professorRepository.findByNameContainingIgnoreCase(query).forEach(subject -> results.add(new SearchResultDto(subject.getId(), subject.getName(), Optional.empty(), Optional.empty(), 3)));

        return ResponseEntity.ok().body(Map.of("results", results));
    }

}
