package com.miet.pgbooking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    // Ye bean BCrypt hashing provide karega
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // Ye config baaki APIs ko block hone se bachayegi development ke dauran
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Postman/Thunder Client se testing ke liye CSRF disable
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // Abhi saari APIs open rakhi hain taaki aage ka kaam na ruke
            );
        return http.build();
    }
}