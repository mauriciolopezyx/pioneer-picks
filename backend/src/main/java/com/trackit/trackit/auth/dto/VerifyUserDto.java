package com.trackit.trackit.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record VerifyUserDto(
        @Email String email,
        @NotBlank String verificationCode
) {}