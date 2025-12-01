package com.pioneerpicks.pioneerpicks.user.dto;

import jakarta.validation.constraints.NotBlank;

public record DeleteAccountDto(@NotBlank String password) {}
