package com.abhi.parkspace.parking.dto.request;

import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record ParkingSpotRequest(

        @NotBlank(message = "Spot number is required")

        @Pattern(
                regexp = "^[A-Z]{1}[0-9]{1,4}$",
                message = "Invalid parking spot number"
        )
        String spotNumber,

        @NotNull(message = "Parking spot type is required")
        ParkingSpotType spotType,

        @NotNull(message = "Parking spot status is required")
        ParkingSpotStatus status
) {
}