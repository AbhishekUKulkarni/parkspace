package com.abhi.parkspace.booking.controller;

import com.abhi.parkspace.auth.entity.User;

import com.abhi.parkspace.booking.dto.BookingRequest;
import com.abhi.parkspace.booking.dto.BookingResponse;
import com.abhi.parkspace.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(bookingService.createBooking(request, user));
    }

    @PutMapping("/{bookingId}/end")
    public ResponseEntity<String> endBooking(
            @PathVariable UUID bookingId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        bookingService.endBooking(bookingId, user);

        return ResponseEntity.ok("Booking ended");
    }

    @GetMapping("/active")
    public ResponseEntity<BookingResponse> getActiveBooking(
            @RequestParam UUID vehicleId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                bookingService.getActiveBooking(vehicleId, user)
        );
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getUserBookings(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                bookingService.getUserBookings(user)
        );
    }
}