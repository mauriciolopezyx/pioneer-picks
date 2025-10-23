package com.pioneerpicks.pioneerpicks.comments.dto;

import java.time.LocalDate;
import java.util.UUID;

public record FullCommentDto(UUID id, String name, LocalDate date, String body) {}
