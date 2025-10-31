package com.pioneerpicks.pioneerpicks.professors.dto;

import java.util.UUID;

public interface ProfessorCommentCountDto {
    UUID getProfessorId();
    long getCommentCount();
}
