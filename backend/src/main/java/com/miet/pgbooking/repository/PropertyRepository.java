package com.miet.pgbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.miet.pgbooking.entity.Property;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {

    // Filter query: City match kare aur Rent maxRent se kam ya barabar ho
    @Query("SELECT p FROM Property p WHERE LOWER(p.city) = LOWER(:city) AND p.rent <= :maxRent")
    List<Property> filterProperties(@Param("city") String city, @Param("maxRent") Double maxRent);

    // Specific owner ke properties fetch karne ke liye
    List<Property> findByOwnerId(Long ownerId);
}