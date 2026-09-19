package com.miet.pgbooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.dto.LoginDto;
import com.miet.pgbooking.entity.User;
import com.miet.pgbooking.service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") // <-- React se connection allow karne ke liye
public class UserController {

    @Autowired
    private UserService userService;

    // POST API - Naya user register karne ke liye
    @PostMapping("/signup")
    public String registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return "Badhai ho! Naya user (" + savedUser.getRole() + ") successfully register ho gaya!";
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody LoginDto loginDto) {
        return userService.loginUser(loginDto.getEmail(), loginDto.getPassword());
    }
}