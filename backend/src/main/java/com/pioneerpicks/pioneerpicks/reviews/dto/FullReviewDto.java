package com.pioneerpicks.pioneerpicks.reviews.dto;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

public record FullReviewDto(UUID id,
                            String name,
                            Date date,
                            String semester,
                            Integer location,
                            Integer workload,
                            Integer leniency,
                            Integer assignments,
                            Integer communication,
                            Boolean curve,
                            Boolean attendance,
                            Boolean late,
                            Optional<String> textbook,
                            String positive,
                            String negative
) {}
