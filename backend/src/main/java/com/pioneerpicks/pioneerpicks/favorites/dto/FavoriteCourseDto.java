package com.pioneerpicks.pioneerpicks.favorites.dto;

import java.util.UUID;

public record FavoriteCourseDto(UUID id, String name, String subject, String abbreviation, String subjectAbbreviation) {}