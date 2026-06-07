package com.abhi.parkspace.vehicle.dto.response;

import com.abhi.parkspace.vehicle.entity.VehicleType;

import java.time.LocalDateTime;
import java.util.UUID;

public record VehicleResponse(

        UUID id,
        String vehicleNumber,
        VehicleType vehicleType,
        String brand,
        String model,
        String color,
        String ownerEmail,
        LocalDateTime createdAt
) {
}