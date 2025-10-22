package com.pioneerpicks.pioneerpicks.professors.dto;

import java.util.UUID;

public record BasicProfessorDto(UUID id, String name, Long reviewCount, Long commentCount) {}
