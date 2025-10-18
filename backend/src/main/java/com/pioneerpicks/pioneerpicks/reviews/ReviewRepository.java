package com.pioneerpicks.pioneerpicks.reviews;

import com.pioneerpicks.pioneerpicks.courses.Course;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByProfessorAndCourse(Professor professor, Course course); // this would be if we had their entities (won't be used though)
    List<Review> findByProfessorIdAndCourseId(UUID professorId, UUID courseId);

}
