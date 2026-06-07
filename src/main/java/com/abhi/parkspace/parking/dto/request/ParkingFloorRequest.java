package com.abhi.parkspace.parking.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ParkingFloorRequest(

        @Min(
                value = 0,
                message = "Floor number cannot be negative"
        )
        Integer floorNumber,

        @NotBlank(message = "Floor name is required")
        String floorName
) {
}