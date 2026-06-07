package com.abhi.parkspace.booking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.request.CreateBookingRequest;
import com.abhi.parkspace.booking.dto.request.UpdateBookingStatusRequest;
import com.abhi.parkspace.booking.dto.response.BookingResponse;

import java.util.List;
import java.util.UUID;

public interface BookingService {

    BookingResponse createBooking(
            CreateBookingRequest request,
            User user
    );

    List<BookingResponse> getUserBookings(
            User user
    );

    BookingResponse getBookingById(
            UUID bookingId,
            User user
    );

    BookingResponse updateBookingStatus(
            UUID bookingId,
            UpdateBookingStatusRequest request,
            User user
    );

    void cancelBooking(
            UUID bookingId,
            User user
    );
}