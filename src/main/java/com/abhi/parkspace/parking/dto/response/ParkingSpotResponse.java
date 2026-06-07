package com.abhi.parkspace.parking.dto.response;

import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParkingSpotResponse(

        UUID id,

        String spotNumber,

        ParkingSpotType spotType,

        ParkingSpotStatus status,

        Boolean active,

        UUID parkingFloorId,

        LocalDateTime createdAt
) {
}