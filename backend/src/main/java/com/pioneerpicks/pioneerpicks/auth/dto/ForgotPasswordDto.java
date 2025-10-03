package com.pioneerpicks.pioneerpicks.auth.dto;

import jakarta.validation.constraints.Email;

public record ForgotPasswordDto(
        @Email String email
) {}
