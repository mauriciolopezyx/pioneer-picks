package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.user.dto.FullUserDto;
import com.pioneerpicks.pioneerpicks.user.dto.ResetPasswordDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> getUserInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("PRINCIPAL CLASS AFTER SET: " + authentication.getPrincipal().getClass());
        User user = (User) authentication.getPrincipal();

        FullUserDto dto = new FullUserDto(user.getUsername(), user.getEmail(), user.getRole().toString());
        return ResponseEntity.ok().body(dto);
    }

    public void resetPassword(User currentUser, ResetPasswordDto input) {
        System.out.println("Received reset password request");

        if (currentUser.hasPassword() && input.oldPassword() == null) {
            throw new RuntimeException("Expected old password in addition to new password");
        }
        if (currentUser.hasPassword() && !passwordEncoder.matches(input.oldPassword(), currentUser.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        currentUser.setPassword(passwordEncoder.encode(input.newPassword()));
        userRepository.save(currentUser);
    }

}
