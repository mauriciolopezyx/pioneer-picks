package com.pioneerpicks.pioneerpicks.search.dto;

import java.util.UUID;

public record CourseSearchResultDto(UUID id, String name, String abbreviation, String subject, String subjectAbbreviation) {}