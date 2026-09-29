package com.abhi.parkspace.parking.dto;

import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ParkingSpotRequest(

        @NotBlank(message = "Spot number is required")
        String spotNumber,

        @NotNull(message = "Status is required")
        ParkingSpotStatus status
) {}