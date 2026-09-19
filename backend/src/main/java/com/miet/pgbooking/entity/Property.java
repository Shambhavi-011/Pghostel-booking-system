package com.miet.pgbooking.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String pgName;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private Double rent;

    private Integer sharingType; // 1 = Single, 2 = Double, etc.
    private Boolean hasAc;
    private String description;
    private Long ownerId; // Owner User ka ID

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPgName() { return pgName; }
    public void setPgName(String pgName) { this.pgName = pgName; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getRent() { return rent; }
    public void setRent(Double rent) { this.rent = rent; }

    public Integer getSharingType() { return sharingType; }
    public void setSharingType(Integer sharingType) { this.sharingType = sharingType; }

    public Boolean getHasAc() { return hasAc; }
    public void setHasAc(Boolean hasAc) { this.hasAc = hasAc; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}