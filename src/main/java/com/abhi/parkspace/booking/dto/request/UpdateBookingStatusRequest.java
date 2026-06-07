package com.abhi.parkspace.booking.dto.request;

import com.abhi.parkspace.booking.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBookingStatusRequest(

        @NotNull(message = "Booking status is required")
        BookingStatus bookingStatus
) {
}