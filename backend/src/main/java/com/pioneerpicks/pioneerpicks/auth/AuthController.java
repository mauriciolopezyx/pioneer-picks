package com.pioneerpicks.pioneerpicks.auth;

import com.pioneerpicks.pioneerpicks.auth.dto.*;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/auth")
@RestController
class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @RequestBody @Valid RegisterUserDto registerUserDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Register validation failed");
        }
        System.out.println("Received register attempt with " + registerUserDto.email() + " and password " + registerUserDto.password());
        return authService.register(registerUserDto);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> authenticate(
            @RequestBody @Valid LoginUserDto loginUserDto,
            HttpServletRequest request,
            HttpServletResponse response,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Login validation failed");
        }
        System.out.println("Received login request " + System.currentTimeMillis());
        return authService.authenticate(loginUserDto, request, response);
    }

    @PostMapping("/verify")
    public ResponseEntity<LoginResponseDto> verifyUser(
            @RequestBody @Valid VerifyUserDto verifyUserDto,
            HttpServletRequest request,
            HttpServletResponse response,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Verify validation failed");
        }
        return authService.verifyUser(verifyUserDto, request, response);
    }

    @PostMapping("/resend")
    public ResponseEntity<Void> resendVerificationCode(
            @RequestBody @Valid ForgotPasswordDto forgotPasswordDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Resend code validation failed");
        }
        return authService.resendVerificationCode(forgotPasswordDto.email());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @RequestBody @Valid ForgotPasswordDto forgotPasswordDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Forgot password validation failed");
        }
        return authService.forgotPasswordInitiate(forgotPasswordDto.email());
    }
    @PostMapping("/forgot-password/code")
    public ResponseEntity<Map<Object, Object>> forgotPasswordCodeValidate(
            @RequestBody @Valid VerifyUserDto verifyUserDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Forgot password verify validation failed");
        }
        return authService.forgotPasswordCodeValidate(verifyUserDto);
    }
    @PostMapping("/forgot-password/code/resend")
    public ResponseEntity<Void> forgotPasswordCodeResend(
            @RequestBody @Valid ForgotPasswordDto forgotPasswordDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Forgot password resend code validation failed");
        }
        return authService.resendVerificationCode(forgotPasswordDto.email());
    }
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<Void> forgotPasswordReset(
            @RequestBody @Valid ForgotPasswordResetDto forgotPasswordResetDto,
            HttpServletRequest request,
            HttpServletResponse response,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Forgot password full-reset validation failed");
        }
        return authService.forgotPasswordFullValidate(forgotPasswordResetDto, request, response);
    }

}
