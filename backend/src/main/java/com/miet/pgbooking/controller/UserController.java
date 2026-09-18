package com.miet.pgbooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.entity.User;
import com.miet.pgbooking.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // POST API - Naya user register karne ke liye
    @PostMapping("/signup")
    public String registerUser(@RequestBody User user) {
        // Data ko database me save karo
        userRepository.save(user);
        return "Badhai ho! Naya user (" + user.getRole() + ") successfully register ho gaya!";
    }
}