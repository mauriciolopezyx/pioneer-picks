package com.pioneerpicks.pioneerpicks.comments;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentService(
            CommentRepository commentRepository
    ) {
        this.commentRepository = commentRepository;
    }

    public ResponseEntity<?> getComments(UUID professorId, UUID courseId) {
        return ResponseEntity.ok().body(Map.of("comments", commentRepository.findByProfessorIdAndCourseId(professorId, courseId)));
    }

}
