package com.abhi.parkspace.parking.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record ParkingLotResponse(

        UUID id,
        String name,
        String address,
        String adminEmail,
        Boolean active,
        LocalDateTime createdAt
) {}