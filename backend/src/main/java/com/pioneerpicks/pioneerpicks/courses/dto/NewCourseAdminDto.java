package com.pioneerpicks.pioneerpicks.courses.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record NewCourseAdminDto(UUID subjectId, @NotBlank String name) {}