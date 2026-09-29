package com.abhi.parkspace.booking.dto;

import com.abhi.parkspace.booking.enums.BookingStatus;

import java.time.Instant;
import java.util.UUID;

public record BookingResponse(

        UUID bookingId,
        UUID vehicleId,
        UUID parkingSpotId,
        BookingStatus status,
        Instant startTime,
        Instant endTime

) {
}