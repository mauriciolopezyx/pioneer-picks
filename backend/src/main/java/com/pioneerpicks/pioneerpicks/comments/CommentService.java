package com.pioneerpicks.pioneerpicks.comments;

import com.pioneerpicks.pioneerpicks.comments.dto.FullCommentDto;
import com.pioneerpicks.pioneerpicks.professors.Professor;
import com.pioneerpicks.pioneerpicks.professors.ProfessorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final ProfessorRepository professorRepository;

    public CommentService(
            CommentRepository commentRepository,
            ProfessorRepository professorRepository
    ) {
        this.commentRepository = commentRepository;
        this.professorRepository = professorRepository;
    }

    public ResponseEntity<?> getComments(UUID professorId, UUID courseId) {
        return ResponseEntity.ok().body(Map.of("comments", commentRepository.findByProfessorIdAndCourseId(professorId, courseId)));
    }

    public ResponseEntity<?> getCourseProfessorComments(UUID courseId, UUID professorId) {
        Optional<Professor> professor = professorRepository.findById(professorId);
        if (professor.isEmpty()) {
            throw new RuntimeException("Professor not found");
        }

        List<FullCommentDto> dtos = professor.get().getComments().stream()
                .filter(comment -> comment.getCourse() != null && courseId.equals(comment.getCourse().getId()))
                .map(comment -> new FullCommentDto(comment.getId(), comment.getName(), comment.getDate(), comment.getSemester(), comment.getBody()))
                .toList();

        return ResponseEntity.ok().body(dtos);
    }

}
