package com.abhi.parkspace.booking.dto;

import java.util.UUID;

public record BookingRequest(
        UUID vehicleId,
        UUID lotId,
        UUID parkingSpotId
) {
}