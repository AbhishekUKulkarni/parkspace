package com.abhi.parkspace.booking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.BookingRequest;
import com.abhi.parkspace.booking.dto.BookingResponse;

import java.util.List;
import java.util.UUID;

public interface BookingService {

    BookingResponse createBooking(BookingRequest request, User user);

    void endBooking(UUID bookingId, User user);

    BookingResponse getActiveBooking(UUID vehicleId, User user);

    List<BookingResponse> getUserBookings(User user);
}