package com.miet.pgbooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.miet.pgbooking.entity.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    // Ye Spring Boot ka magic hai. Hum location ke hisaab se PG dhoondh payenge!
    Iterable<Property> findByLocationContainingIgnoreCase(String location);
}