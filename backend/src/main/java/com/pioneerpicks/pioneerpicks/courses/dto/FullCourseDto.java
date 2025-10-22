package com.pioneerpicks.pioneerpicks.courses.dto;

import com.pioneerpicks.pioneerpicks.professors.dto.BasicProfessorDto;

import java.util.List;
import java.util.UUID;

public record FullCourseDto(UUID id, String name, String abbreviation, Integer units, String areas, List<BasicProfessorDto> professors) {}
