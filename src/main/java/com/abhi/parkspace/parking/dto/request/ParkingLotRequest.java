package com.abhi.parkspace.parking.dto.request;

import com.abhi.parkspace.parking.enums.ParkingLotStatus;
import jakarta.validation.constraints.*;

public record ParkingLotRequest(

        @NotBlank(message = "Parking lot name is required")
        String name,

        @NotBlank(message = "Address is required")
        String address,

        @NotBlank(message = "City is required")
        String city,

        @NotBlank(message = "State is required")
        String state,

        @Pattern(
                regexp = "^[1-9][0-9]{5}$",
                message = "Invalid Indian pincode"
        )
        String pincode,

        @NotNull(message = "Latitude is required")
        Double latitude,

        @NotNull(message = "Longitude is required")
        Double longitude,

        @Min(
                value = 1,
                message = "Minimum 1 floor required"
        )
        Integer totalFloors,

        @NotNull(message = "Parking lot status is required")
        ParkingLotStatus status
) {
}