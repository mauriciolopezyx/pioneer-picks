package com.pioneerpicks.pioneerpicks.professors.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record NewProfessorDto(UUID courseId, @NotBlank String name) {}