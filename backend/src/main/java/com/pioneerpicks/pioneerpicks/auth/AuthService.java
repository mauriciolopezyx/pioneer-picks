package com.pioneerpicks.pioneerpicks.auth;

import com.pioneerpicks.pioneerpicks.auth.dto.*;
import com.pioneerpicks.pioneerpicks.email.EmailService;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import com.pioneerpicks.pioneerpicks.exception.ForbiddenException;
import com.pioneerpicks.pioneerpicks.exception.NotFoundException;
import com.pioneerpicks.pioneerpicks.exception.UnauthorizedException;
import com.pioneerpicks.pioneerpicks.user.User;
import com.pioneerpicks.pioneerpicks.user.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            EmailService emailService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
    }

    public ResponseEntity<Void> register(RegisterUserDto input) {
        System.out.println(input.email());
        if (!input.email().endsWith("@horizon.csueastbay.edu")) {
            throw new BadRequestException("You must register with your CSUEB email address.");
        }
        Optional<User> userFromEmail = userRepository.findByEmail(input.email());
        if (userFromEmail.isPresent()) {
            throw new BadRequestException("An account with the given email already exists");
        }
        Optional<User> userFromName = userRepository.findByUsername(input.username());
        if (userFromName.isPresent()) {
            throw new BadRequestException("An account with the given username already exists");
        }

        User user = new User(input.username(), input.email(), passwordEncoder.encode(input.password()));
        user.setEnabled(false);
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        sendVerificationEmail(user);
        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<LoginResponseDto> authenticate(
            LoginUserDto input,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User user = userRepository.findByEmail(input.email()).orElseThrow(() -> new NotFoundException("User not found"));
        if (!user.isEnabled()) {
            throw new UnauthorizedException("User is not verified - please verify to continue");
        }
        if (!user.hasPassword()) {
            throw new UnauthorizedException("This account uses " + user.getProvider() + " login. Please login with " + user.getProvider() + " and then reset your password after.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()
                )
        );

        // v NEW setup with Redis session caching
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        request.getSession(true); // make sure a session exists
        new HttpSessionSecurityContextRepository().saveContext(context, request, response);

        System.out.println("SESSION ID from request: " + request.getSession().getId());

        LoginResponseDto loginResponse = new LoginResponseDto(request.getSession().getId());

        return ResponseEntity.ok(loginResponse);
    }

    public ResponseEntity<LoginResponseDto> verifyUser(
            VerifyUserDto input,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        User user = userRepository.findByEmail(input.email()).orElseThrow(() -> new NotFoundException("User not found"));
        if (user.isEnabled()) {
            throw new BadRequestException("Account already verified");
        }
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired");
        }
        if (user.getVerificationCode().equals(input.verificationCode())) {
            user.setEnabled(true);
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            userRepository.save(user);
        } else {
            throw new BadRequestException("Invalid verification code");
        }

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );

        // v NEW setup with Redis session caching
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        request.getSession(true); // make sure a session exists
        new HttpSessionSecurityContextRepository().saveContext(context, request, response);

        LoginResponseDto loginResponse = new LoginResponseDto(request.getSession().getId());

        return ResponseEntity.ok(loginResponse);
    }

    public ResponseEntity<Void> resendVerificationCode(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("User not found"));
        if (user.isEnabled()) {
            throw new BadRequestException("User is already verified");
        }
        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        sendVerificationEmail(user);
        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }

    public void sendVerificationEmail(User user) {
        String subject = "Account Verification";
        String verificationCode = user.getVerificationCode();
        String htmlMessage = "<html>"
                + "<body style=\"font-family: Arial, sans-serif;\">"
                + "<div style=\"background-color: #f5f5f5; padding: 20px;\">"
                + "<h2 style=\"color: #333;\">Welcome to Pioneer Picks!</h2>"
                + "<p style=\"font-size: 16px;\">Please enter the following verification code in the website to continue!</p>"
                + "<div style=\"background-color: #fff; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);\">"
                + "<p style=\"font-size: 18px; font-weight: bold; color: #007bff;\">" + verificationCode + "</p>"
                + "</div>"
                + "</div>"
                + "</body>"
                + "</html>";
        try {
            emailService.sendVerificationEmail(user.getEmail(), subject, htmlMessage);
        } catch (MessagingException e) {
            e.printStackTrace();
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }

    public ResponseEntity<Void> forgotPasswordInitiate(String email) {
        System.out.println("starting forgot password process...");
        User user = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("An account with the given email does not exist"));
        if (!user.isEnabled()) {
            throw new UnauthorizedException("Email is not verified");
        }

        // TODO: checking live sessions, and declining if any valid session present

        user.setVerificationCode(generateVerificationCode());
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        sendVerificationEmail(user);
        userRepository.save(user);

        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<Map<Object, Object>> forgotPasswordCodeValidate(VerifyUserDto input) {
        System.out.println("Validating forgot password code.. received " + input.verificationCode());
        User user = userRepository.findByEmail(input.email()).orElseThrow(() -> new NotFoundException("An account with the given email does not exist"));
        if (!user.isEnabled()) {
            throw new UnauthorizedException("Email is not verified");
        }
        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code has expired");
        }
        if (!user.getVerificationCode().equals(input.verificationCode())) {
            throw new BadRequestException("Invalid verification code");
        }
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);

        String generatedForgotToken = UUID.randomUUID().toString();
        user.setForgotPasswordToken(generatedForgotToken);
        user.setForgotPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(15));

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("token", generatedForgotToken));
    }

    public ResponseEntity<Void> forgotPasswordFullValidate(
            ForgotPasswordResetDto forgotPasswordResetDto,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        System.out.println("Attempting to reset password from forgot password process...");

        User user = userRepository.findByEmail(forgotPasswordResetDto.email()).orElseThrow(() -> new NotFoundException("An account with the given email does not exist"));
        if (!user.isEnabled()) {
            throw new UnauthorizedException("Email is not verified");
        }
        if (user.getForgotPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Your session has expired, please refresh and try again");
        }
        if (!user.getForgotPasswordToken().equals(forgotPasswordResetDto.forgotToken())) {
            throw new BadRequestException("Your session has expired, please refresh and try again");
        }
        user.setForgotPasswordToken(null);
        user.setForgotPasswordTokenExpiresAt(null);
        user.setPassword(passwordEncoder.encode(forgotPasswordResetDto.newPassword()));

        userRepository.save(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user,
                null,
                user.getAuthorities()
        );

        // v NEW setup with Redis session caching
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        request.getSession(true); // make sure a session exists
        new HttpSessionSecurityContextRepository().saveContext(context, request, response);

        return ResponseEntity.noContent().build();
    }

}
