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
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
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

    public ResponseEntity<Void> authenticate(
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

        try {
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
            HttpSession session = request.getSession(true); // creates session if missing
            SecurityContextRepository repo = new HttpSessionSecurityContextRepository();
            repo.saveContext(context, request, response);

            // needs to be build() specifically
            return ResponseEntity.noContent().build();
        } catch (AuthenticationException e) {
            throw new UnauthorizedException("Wrong email or password, please try again");
        }
    }

    public ResponseEntity<Void> verifyUser(
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
        HttpSession session = request.getSession(true); // creates session if missing
        SecurityContextRepository repo = new HttpSessionSecurityContextRepository();
        repo.saveContext(context, request, response);

        // needs to be build() specifically
        return ResponseEntity.noContent().build();
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
        String verificationCode = user.getVerificationCode();
        String subject = verificationCode + " is your verification code";
        String htmlMessage = "<html>"
                + "<head>"
                + "<link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap\" rel=\"stylesheet\">"
                + "</head>"
                + "<body style=\"font-family: 'Montserrat', Arial, sans-serif; margin: 0; padding: 0;\">"
                + "<div style=\"padding: 20px;\">"
                + "<h2 style=\"font-family: 'Montserrat', sans-serif; color: #000; font-weight: 700;\">Pioneer Picks</h2>"
                + "<p style=\"font-family: 'Montserrat', sans-serif; font-size: 16px; font-weight: 400;\">Please enter the following verification code when prompted:</p>"
                + "<p style=\"font-family: 'Montserrat', sans-serif; font-size: 24px; font-weight: 700; color: #d50032;\">" + verificationCode + "</p>"
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
        HttpSession session = request.getSession(true); // creates session if missing
        SecurityContextRepository repo = new HttpSessionSecurityContextRepository();
        repo.saveContext(context, request, response);

        // needs to be build() specifically
        return ResponseEntity.noContent().build();
    }

}
