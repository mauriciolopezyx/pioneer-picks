package com.trackit.trackit.auth.dto;

import jakarta.validation.constraints.Email;

public record ForgotPasswordDto(
        @Email String email
) {}
