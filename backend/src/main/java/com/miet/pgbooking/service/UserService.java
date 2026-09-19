package com.miet.pgbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.miet.pgbooking.entity.User;
import com.miet.pgbooking.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- First Method: Signup ---
    public User registerUser(User user) {
        // Password ko save karne se pehle hash kar rahe hain
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        
        return userRepository.save(user);
    } // Yahan registerUser method khatam ho gaya

    // --- Second Method: Login (Yeh bahar hona chahiye) ---
    public String loginUser(String email, String rawPassword) {
        // 1. Email se user dhoondho
        var userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isEmpty()) {
            return "Error: Yeh email registered nahi hai.";
        }

        User user = userOptional.get();

        // 2. Password match karo
        boolean isPasswordMatch = passwordEncoder.matches(rawPassword, user.getPassword());

        if (isPasswordMatch) {
            // TODO: Next step me hum yahan JWT token generate karenge
            return "Success: Login successful! Welcome " + user.getName() + " (" + user.getRole() + ")";
        } else {
            return "Error: Password galat hai.";
        }
    }
}