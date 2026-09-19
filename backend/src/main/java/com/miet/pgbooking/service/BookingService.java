package com.miet.pgbooking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.repository.BookingRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    // Tenant booking request bhejega
    public Booking createBookingRequest(Booking booking) {
        booking.setBookingDate(LocalDate.now());
        booking.setStatus("PENDING"); // Initial status hamesha pending hoga
        return bookingRepository.save(booking);
    }

    // Tenant apna dashboard dekhega
    public List<Booking> getTenantBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId);
    }

    // Owner apna dashboard dekhega
    public List<Booking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findBookingsForOwner(ownerId);
    }

    // Owner booking ko accept ya reject karega
    public String updateBookingStatus(Long bookingId, String newStatus) {
        Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isPresent()) {
            Booking booking = optionalBooking.get();
            booking.setStatus(newStatus.toUpperCase());
            bookingRepository.save(booking);
            return "Booking status updated to: " + newStatus;
        }
        return "Error: Booking not found!";
    }
}