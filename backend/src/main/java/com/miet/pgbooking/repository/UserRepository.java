package com.miet.pgbooking.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miet.pgbooking.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Database me email se user dhoondhne ka custom function
    Optional<User> findByEmail(String email);
}