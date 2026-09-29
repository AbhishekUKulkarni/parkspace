package com.abhi.parkspace.booking.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record BookingRequest(

        UUID vehicleId,

        UUID parkingSpotId,

        LocalDateTime startTime,

        LocalDateTime endTime

) {}