package com.miet.pgbooking;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.entity.Property;
import com.miet.pgbooking.repository.BookingRepository;
import com.miet.pgbooking.repository.PropertyRepository;
import com.miet.pgbooking.service.BookingService;

@SpringBootTest
@Transactional
class BookingFlowIntegrationTest {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Test
    void bookingCanBeCreatedListedAndUpdated() {
        List<Property> properties = propertyRepository.findAll();
        assertFalse(properties.isEmpty(), "The test database needs at least one property.");

        Booking request = new Booking();
        request.setPropertyId(properties.get(0).getId());
        request.setFullName("Booking Integration Test");
        request.setPhone("9876543210");
        request.setMoveInDate(LocalDate.now().plusDays(1));

        Booking created = bookingService.createBookingRequest(request);
        assertEquals("PENDING", created.getStatus());
        assertEquals("Booking Integration Test", created.getFullName());
        assertEquals("9876543210", created.getPhone());
        assertTrue(bookingService.getAllBookings().stream().anyMatch(booking -> booking.getId().equals(created.getId())));

        Booking updated = bookingService.updateBookingStatus(created.getId(), "CONFIRMED");
        assertEquals("CONFIRMED", updated.getStatus());
        assertEquals("CONFIRMED", bookingRepository.findById(created.getId()).orElseThrow().getStatus());
    }
}
