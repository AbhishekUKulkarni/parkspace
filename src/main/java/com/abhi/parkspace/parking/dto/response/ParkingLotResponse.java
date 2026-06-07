package com.abhi.parkspace.parking.dto.response;

import com.abhi.parkspace.parking.enums.ParkingLotStatus;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParkingLotResponse(

        UUID id,

        String name,

        String address,

        String city,

        String state,

        String pincode,

        Double latitude,

        Double longitude,

        Integer totalFloors,

        ParkingLotStatus status,

        Boolean active,

        String adminEmail,

        LocalDateTime createdAt
) {
}