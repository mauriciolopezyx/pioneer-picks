package com.pioneerpicks.pioneerpicks.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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
    Optional<User> findUserWithFavoriteCoursesAndSubjects(Long userId);

    @Query("""
    SELECT DISTINCT u
    FROM User u
    LEFT JOIN FETCH u.favoriteProfessors p
    WHERE u.id = :userId
    """)
    Optional<User> findUserWithFavoriteProfessors(Long userId);

    @Query("""
    SELECT COUNT(p) > 0
    FROM User u
    JOIN u.favoriteProfessors p
    WHERE u.id = :userId AND p.id = :professorId
    """)
    boolean isProfessorFavoritedByUser(Long userId, UUID professorId);

    @Query("""
    SELECT COUNT(c) > 0
    FROM User u
    JOIN u.favoriteCourses c
    WHERE u.id = :userId AND c.id = :courseId
    """)
    boolean isCourseFavoritedByUser(Long userId, UUID courseId);

    Optional<User> findByEmail(String email);
    Optional<User> findByVerificationCode(String verificationCode);
    Optional<User> findByUsername(String username);
}
