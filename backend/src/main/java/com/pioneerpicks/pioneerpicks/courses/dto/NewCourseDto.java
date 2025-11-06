package com.pioneerpicks.pioneerpicks.courses.dto;

import jakarta.validation.constraints.NotBlank;

public record NewCourseDto(@NotBlank String subject, @NotBlank String name) {}