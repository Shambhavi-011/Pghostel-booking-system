package com.miet.pgbooking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.repository.BookingRepository;
import com.miet.pgbooking.repository.PropertyRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public Booking createBookingRequest(Booking booking) {
        if (booking.getPropertyId() == null || !propertyRepository.existsById(booking.getPropertyId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Choose a valid PG listing.");
        }
        if (booking.getFullName() == null || booking.getFullName().isBlank() || booking.getFullName().trim().length() > 120) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a name between 1 and 120 characters.");
        }
        if (booking.getPhone() == null || !booking.getPhone().replaceAll("\\D", "").matches("\\d{7,15}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid phone number.");
        }
        if (booking.getMoveInDate() == null || booking.getMoveInDate().isBefore(LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Move-in date must be today or later.");
        }

        booking.setId(null);
        booking.setBookingDate(LocalDate.now());
        booking.setFullName(booking.getFullName().trim());
        booking.setPhone(booking.getPhone().trim());
        booking.setStatus("PENDING");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc();
    }

    public List<Booking> getTenantBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId);
    }

    public List<Booking> getOwnerBookings(Long ownerId) {
        return bookingRepository.findBookingsForOwner(ownerId);
    }

    public Booking updateBookingStatus(Long bookingId, String newStatus) {
        if (newStatus == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required.");
        }
        String normalizedStatus = newStatus.toUpperCase(Locale.ROOT);
        if (!normalizedStatus.equals("CONFIRMED") && !normalizedStatus.equals("REJECTED")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status must be CONFIRMED or REJECTED.");
        }
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        booking.setStatus(normalizedStatus);
        return bookingRepository.save(booking);
    }
}
