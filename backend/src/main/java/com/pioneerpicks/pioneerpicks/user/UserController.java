package com.pioneerpicks.pioneerpicks.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/user")
@RestController
public class UserController {

    // private final UserService userService;

//    public UserController(UserService userService) {
//        this.userService = userService;
//    }

    @GetMapping("/ok")
    public ResponseEntity<?> isAuthenticated() {
        System.out.println("Received ok request?");
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
