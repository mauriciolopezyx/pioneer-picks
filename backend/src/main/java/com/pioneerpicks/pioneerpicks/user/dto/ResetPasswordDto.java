package com.pioneerpicks.pioneerpicks.user.dto;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDto(
        @NotBlank
        String oldPassword,
        @NotBlank
        String newPassword
) {}
