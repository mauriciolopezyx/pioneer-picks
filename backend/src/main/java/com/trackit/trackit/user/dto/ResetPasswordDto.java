package com.trackit.trackit.user.dto;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordDto(
        @NotBlank
        String oldPassword,
        @NotBlank
        String newPassword
) {}
