package com.abhi.parkspace.vehicle.dto.request;

import com.abhi.parkspace.vehicle.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record VehicleRequest(

        @NotBlank(message = "Vehicle number is required")

        @Pattern(
                regexp =
                        "^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$",

                message =
                        "Invalid Indian vehicle registration number"
        )
        String vehicleNumber,

        @NotNull(message = "Vehicle type is required")
        VehicleType vehicleType,

        @NotBlank(message = "Brand is required")
        String brand,

        @NotBlank(message = "Model is required")
        String model,

        @NotBlank(message = "Color is required")
        String color
) {
}