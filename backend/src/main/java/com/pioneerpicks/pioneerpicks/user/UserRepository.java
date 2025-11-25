package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("""
    SELECT DISTINCT u
    FROM User u
    LEFT JOIN FETCH u.favoriteCourses c
    LEFT JOIN FETCH c.subject
    WHERE u.id = :userId
    """)
    Optional<User> findUserWithFavoriteCoursesAndSubjects(@Param("userId") Long userId);

    @Query("""
    SELECT DISTINCT u
    FROM User u
    LEFT JOIN FETCH u.favoriteProfessors p
    WHERE u.id = :userId
    """)
    Optional<User> findUserWithFavoriteProfessors(@Param("userId") Long userId);

    @Query("""
    SELECT c
    FROM User u
    JOIN u.favoriteCourses c
    WHERE u.id = :userId
    """)
    Page<Course> findFavoriteCourses(@Param("userId") Long userId, Pageable pageable);

    @Query("""
    SELECT p
    FROM User u
    JOIN u.favoriteProfessors p
    WHERE u.id = :userId
    """)
    Page<Professor> findFavoriteProfessors(@Param("userId") Long userId, Pageable pageable);

    @Query("""
    SELECT COUNT(p) > 0
    FROM User u
    JOIN u.favoriteProfessors p
    WHERE u.id = :userId AND p.id = :professorId
    """)
    boolean isProfessorFavoritedByUser(@Param("userId") Long userId, @Param("professorId") UUID professorId);

    @Query("""
    SELECT COUNT(c) > 0
    FROM User u
    JOIN u.favoriteCourses c
    WHERE u.id = :userId AND c.id = :courseId
    """)
    boolean isCourseFavoritedByUser(@Param("userId") Long userId, @Param("courseId") UUID courseId);

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
}
