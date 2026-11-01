package com.miet.pgbooking.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.miet.pgbooking.dto.PaymentOrderResponse;
import com.miet.pgbooking.entity.Booking;
import com.miet.pgbooking.repository.BookingRepository;
import com.miet.pgbooking.repository.PropertyRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Value("${razorpay.key.id:rzp_test_placeholder}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:placeholder_secret}")
    private String razorpayKeySecret;

    public PaymentOrderResponse createRazorpayOrder() {
        int tokenAmountInPaise = 500 * 100; // ₹500 in paise

        // If placeholder keys are present in dev, provide a mock test order so app runs smoothly
        if (razorpayKeyId == null || razorpayKeyId.contains("placeholder")) {
            return new PaymentOrderResponse(
                    "order_demo_" + System.currentTimeMillis(),
                    tokenAmountInPaise,
                    "INR",
                    razorpayKeyId
            );
        }

        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", tokenAmountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(orderRequest);
            String orderId = order.get("id");

            return new PaymentOrderResponse(orderId, tokenAmountInPaise, "INR", razorpayKeyId);
        } catch (RazorpayException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Razorpay error: " + e.getMessage());
        }
    }

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

        // The request goes to the owner first; payment is UNPAID until owner approves
        if (booking.getPaymentStatus() == null || booking.getPaymentStatus().isBlank()) {
            booking.setPaymentStatus("UNPAID");
        }

        return bookingRepository.save(booking);
    }

    public Booking recordPayment(Long bookingId, String paymentId, String paymentStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        booking.setPaymentId(paymentId);
        booking.setPaymentStatus(paymentStatus != null ? paymentStatus : "PAID");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc();
    }

    public List<Booking> getTenantBookings(Long tenantId) {
        return bookingRepository.findByTenantId(tenantId);
    }

    public List<Booking> getBookingsByPhone(String phone) {
        return bookingRepository.findByPhone(phone);
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
