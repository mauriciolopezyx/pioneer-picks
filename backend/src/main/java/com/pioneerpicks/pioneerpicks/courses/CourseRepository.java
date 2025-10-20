package com.pioneerpicks.pioneerpicks.courses;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {
    List<Course> findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(String q1, String q2);
    List<Course> findBySubjectId(UUID subjectId);
}
