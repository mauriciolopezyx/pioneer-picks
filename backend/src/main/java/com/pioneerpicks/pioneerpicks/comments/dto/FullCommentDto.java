package com.pioneerpicks.pioneerpicks.comments.dto;

import java.util.Date;
import java.util.UUID;

public record FullCommentDto(UUID id, String name, Date date, String semester, String body) {}
