package com.miet.pgbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miet.pgbooking.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Ye line Spring Boot ko batati hai ki Email se user ko kaise dhoondhna hai
    User findByEmail(String email);
}