package com.pioneerpicks.pioneerpicks.reviews.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Optional;

public record PostReviewDto(
        @NotBlank
        String semester,
        Integer location,
        Integer workload,
        Integer leniency,
        Integer assignments,
        Integer communication,
        Boolean curve,
        Boolean attendance,
        Boolean late,
        Optional<String> textbook,
        @NotBlank
        String positive,
        @NotBlank
        String negative
) {}
