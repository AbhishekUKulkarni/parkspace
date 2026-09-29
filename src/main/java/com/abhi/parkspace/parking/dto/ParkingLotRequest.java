package com.abhi.parkspace.parking.dto;

import jakarta.validation.constraints.NotBlank;

public record ParkingLotRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Address is required")
        String address
) {}