package com.miet.pgbooking.entity;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ye bata raha hai ki ek user (tenant) multiple bookings kar sakta hai
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User tenant;

    // Ye bata raha hai ki ek PG me multiple bookings ho sakti hain
    @ManyToOne
    @JoinColumn(name = "property_id", nullable = false)
    private Property property;

    private LocalDate bookingDate;
    
    private String status; // Yahan hum likhenge: "PENDING", "CONFIRMED", ya "CANCELLED"
}