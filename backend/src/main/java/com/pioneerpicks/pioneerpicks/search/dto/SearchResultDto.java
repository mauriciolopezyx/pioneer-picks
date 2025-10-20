package com.pioneerpicks.pioneerpicks.search.dto;

import java.util.Optional;
import java.util.UUID;

public record SearchResultDto(UUID id, String name, Optional<String> abbreviation, Optional<String> subject, Integer category) {}
