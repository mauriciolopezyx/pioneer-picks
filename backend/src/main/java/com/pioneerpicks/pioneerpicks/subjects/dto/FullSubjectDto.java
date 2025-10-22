package com.pioneerpicks.pioneerpicks.subjects.dto;

import com.pioneerpicks.pioneerpicks.courses.dto.BasicCourseDto;

import java.util.List;
import java.util.UUID;

public record FullSubjectDto(UUID id, String name, String abbreviation, String description, List<BasicCourseDto> courses) {}
