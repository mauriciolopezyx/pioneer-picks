package com.pioneerpicks.pioneerpicks.courses.dto;

import java.util.UUID;

public record BasicCourseDto(UUID id, String name, String abbreviation, Integer units, String areas) {}
