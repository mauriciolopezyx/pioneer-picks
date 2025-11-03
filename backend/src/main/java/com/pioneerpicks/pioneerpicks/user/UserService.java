package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.user.dto.FullUserDto;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(
            UserRepository userRepository
    ) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<?> getUserInformation() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();

        FullUserDto dto = new FullUserDto(user.getUsername(), user.getEmail(), user.getRole().toString());
        return ResponseEntity.ok().body(dto);
    }
    
}
