package com.abhi.parkspace.booking.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.UUID;

public record CreateBookingRequest(

        @NotNull(message = "Vehicle id is required")
        UUID vehicleId,

        @NotNull(message = "Parking spot id is required")
        UUID parkingSpotId,

        @NotNull(message = "Start time is required")

        @Future(
                message =
                        "Start time must be in the future"
        )
        LocalDateTime startTime,

        @NotNull(message = "End time is required")

        @Future(
                message =
                        "End time must be in the future"
        )
        LocalDateTime endTime
) {
}