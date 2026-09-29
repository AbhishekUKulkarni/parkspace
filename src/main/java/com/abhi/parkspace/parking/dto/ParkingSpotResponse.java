package com.abhi.parkspace.parking.dto;

import com.abhi.parkspace.parking.enums.ParkingSpotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParkingSpotResponse(

        UUID id,
        String spotNumber,
        ParkingSpotStatus status,
        UUID parkingLotId,
        LocalDateTime createdAt
) {}