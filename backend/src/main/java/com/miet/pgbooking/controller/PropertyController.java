package com.miet.pgbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.entity.Property;
import com.miet.pgbooking.service.PropertyService;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "http://localhost:3000")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public List<Property> getProperties() {
        return propertyService.getAllProperties();
    }

    @PostMapping("/add")
    public Property addProperty(@RequestBody Property property) {
        return propertyService.addProperty(property);
    }

    @GetMapping("/all")
    public List<Property> getAllProperties() {
        return propertyService.getAllProperties();
    }

    // Filter API: e.g. /api/properties/search?city=Meerut&maxrent=8000
    @GetMapping("/search")
    public List<Property> searchProperties(
            @RequestParam String city,
            @RequestParam Double maxprice) {
        return propertyService.filterProperties(city, maxprice);
    }

    // Owner Dashboard ke liye: e.g. /api/properties/owner/1
    @GetMapping("/owner/{ownerId}")
    public List<Property> getOwnerProperties(@PathVariable Long ownerId) {
        return propertyService.getPropertiesByOwner(ownerId);
    }
}