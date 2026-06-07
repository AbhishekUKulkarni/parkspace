package com.abhi.parkspace.parking.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParkingFloorResponse(

        UUID id,

        Integer floorNumber,

        String floorName,

        UUID parkingLotId,

        LocalDateTime createdAt
) {
}