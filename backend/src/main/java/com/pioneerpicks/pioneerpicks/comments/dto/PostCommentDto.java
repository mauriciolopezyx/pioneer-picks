package com.pioneerpicks.pioneerpicks.comments.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.Date;

public record PostCommentDto(
        @NotBlank
        String body
) {}
