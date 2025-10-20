package com.pioneerpicks.pioneerpicks.subjects;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, UUID> {

    List<Subject> findByNameContainingIgnoreCaseOrAbbreviationContainingIgnoreCase(String q1, String q2);

    List<Subject> findByName(String query);
    List<Subject> findByAbbreviation(String query);


}
