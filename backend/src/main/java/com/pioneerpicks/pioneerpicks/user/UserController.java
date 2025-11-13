package com.pioneerpicks.pioneerpicks.user;

import com.pioneerpicks.pioneerpicks.user.dto.FullUserDto;
import com.pioneerpicks.pioneerpicks.user.dto.ResetPasswordDto;
import com.pioneerpicks.pioneerpicks.exception.BadRequestException;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/user")
@RestController
class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<FullUserDto> getUserInformation() {
        return userService.getUserInformation();
    }

    @PostMapping("/me/password")
    public ResponseEntity<Void> resetPassword(
            @RequestBody @Valid ResetPasswordDto resetPasswordDto,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            throw new BadRequestException("Reset password validation failed");
        }

        return userService.resetPassword(resetPasswordDto);
    }

}
