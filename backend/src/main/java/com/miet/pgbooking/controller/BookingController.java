package com.miet.pgbooking.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.service.BookingService;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")

public class BookingController {

    @Autowired
    private BookingService bookingService;

    // Tenant requests a PG
    @PostMapping("/request")
    public Booking requestBooking(@RequestBody Booking booking) {
        return bookingService.createBookingRequest(booking);
    }

    // View Tenant's bookings
    @GetMapping("/tenant/{tenantId}")
    public List<Booking> getTenantBookings(@PathVariable Long tenantId) {
        return bookingService.getTenantBookings(tenantId);
    }

    // View Owner's incoming requests
    @GetMapping("/owner/{ownerId}")
    public List<Booking> getOwnerBookings(@PathVariable Long ownerId) {
        return bookingService.getOwnerBookings(ownerId);
    }

    // Owner Accepts/Rejects
    @PutMapping("/{bookingId}/status")
    public String updateStatus(@PathVariable Long bookingId, @RequestParam String status) {
        // e.g. /api/bookings/1/status?status=CONFIRMED
        return bookingService.updateBookingStatus(bookingId, status);
    }
}