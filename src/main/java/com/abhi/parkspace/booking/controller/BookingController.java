package com.abhi.parkspace.booking.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.request.CreateBookingRequest;
import com.abhi.parkspace.booking.dto.request.UpdateBookingStatusRequest;
import com.abhi.parkspace.booking.dto.response.BookingResponse;
import com.abhi.parkspace.booking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody
            CreateBookingRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        bookingService.createBooking(
                                request,
                                user
                        )
                );
    }


    @GetMapping
    public ResponseEntity<List<BookingResponse>>
    getUserBookings(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                bookingService.getUserBookings(user)
        );
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse>
    getBookingById(
            @PathVariable UUID bookingId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                bookingService.getBookingById(
                        bookingId,
                        user
                )
        );
    }


    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponse>
    updateBookingStatus(
            @PathVariable UUID bookingId,
            @Valid @RequestBody
            UpdateBookingStatusRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                bookingService.updateBookingStatus(
                        bookingId,
                        request,
                        user
                )
        );
    }

    @PutMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(
            @PathVariable UUID bookingId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        bookingService.cancelBooking(
                bookingId,
                user
        );

        return ResponseEntity.ok(
                "Booking cancelled successfully"
        );
    }
}