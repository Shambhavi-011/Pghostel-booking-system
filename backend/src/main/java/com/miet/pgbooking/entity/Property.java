package com.miet.pgbooking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pgName; // PG ya Hostel ka naam

    @Column(nullable = false)
    private String location; // Kahan par hai

    @Column(nullable = false)
    private Double price; // Rent kitna hai

    private String description; // PG ke bare me details
    
    private String amenities; // Jaise: "WiFi, AC, Food"
}