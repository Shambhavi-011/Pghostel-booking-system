package com.miet.pgbooking.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.entity.Property;
import com.miet.pgbooking.repository.PropertyRepository;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyRepository propertyRepository;

    // POST API - Naya PG upload karne ke liye (Sirf Owner karega baad me)
    @PostMapping("/add")
    public String addProperty(@RequestBody Property property) {
        propertyRepository.save(property);
        return "Naya PG '" + property.getPgName() + "' successfully upload ho gaya!";
    }

    // GET API - Saare PGs dekhne ke liye (Tenant search karega)
    @GetMapping("/all")
    public Iterable<Property> getAllProperties() {
        return propertyRepository.findAll();
    }
}