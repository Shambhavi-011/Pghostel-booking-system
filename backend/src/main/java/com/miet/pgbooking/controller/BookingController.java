package com.miet.pgbooking.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/create")
    public String createBooking(@RequestBody Booking booking) {
        // Aaj ki date automatically set kar dete hain
        booking.setBookingDate(LocalDate.now());
        booking.setStatus("CONFIRMED");
        
        bookingRepository.save(booking);
        return "Booking successful! Aapka PG book ho gaya hai.";
    }

    @GetMapping("/all")
    public Iterable<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}