package com.pioneerpicks.pioneerpicks.professors.dto;

import java.util.UUID;

public interface ProfessorReviewCountDto {
    UUID getProfessorId();
    long getReviewCount();
}