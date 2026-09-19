package com.miet.pgbooking.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.miet.pgbooking.entity.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Student ko uski saari bookings dikhane ke liye
    List<Booking> findByTenantId(Long tenantId);

    // Owner ko uske PGs par aayi hui saari booking requests dikhane ke liye
    @Query("SELECT b FROM Booking b WHERE b.propertyId IN (SELECT p.id FROM Property p WHERE p.ownerId = :ownerId)")
    List<Booking> findBookingsForOwner(@Param("ownerId") Long ownerId);
}