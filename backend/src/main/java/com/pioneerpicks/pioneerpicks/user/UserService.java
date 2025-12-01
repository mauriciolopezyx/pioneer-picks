package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.user.dto.DeleteAccountDto;
import com.pioneerpicks.pioneerpicks.user.dto.FullUserDto;
import com.pioneerpicks.pioneerpicks.user.dto.ResetPasswordDto;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import com.pioneerpicks.pioneerpicks.exception.UnauthorizedException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<FullUserDto> getUserInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        FullUserDto dto = new FullUserDto(user.getUsername(), user.getEmail(), user.getRole().toString());
        return ResponseEntity.ok(dto);
    }

    public ResponseEntity<Void> resetPassword(ResetPasswordDto input) {
        System.out.println("Received reset password request");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        if (user.hasPassword() && input.oldPassword() == null) {
            throw new BadRequestException("Expected old password in addition to new password");
        }
        if (user.hasPassword() && !passwordEncoder.matches(input.oldPassword(), user.getPassword())) {
            throw new UnauthorizedException("Received password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(input.newPassword()));
        userRepository.save(user);

        return ResponseEntity.noContent().build(); // 204 status code
    }

    public ResponseEntity<Void> deleteAccount(@Valid DeleteAccountDto deleteAccountDto) {
        System.out.println("Received delete account request");

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        if (user.hasPassword() && deleteAccountDto.password() == null) {
            throw new BadRequestException("Expected password, got nothing");
        }
        if (user.hasPassword() && !passwordEncoder.matches(deleteAccountDto.password(), user.getPassword())) {
            throw new UnauthorizedException("Received password is incorrect");
        }

        userRepository.delete(user);

        return ResponseEntity.noContent().build(); // 204 status code
    }

}
