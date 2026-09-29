package com.abhi.parkspace.vehicle.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.vehicle.dto.VehicleRequest;
import com.abhi.parkspace.vehicle.dto.VehicleResponse;
import com.abhi.parkspace.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        VehicleResponse response =
                vehicleService.createVehicle(
                        request,
                        user
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getUserVehicles(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                vehicleService.getUserVehicles(user)
        );
    }


    @GetMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponse> getVehicleById(
            @PathVariable UUID vehicleId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                vehicleService.getVehicleById(
                        vehicleId,
                        user
                )
        );
    }


    @PutMapping("/{vehicleId}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable UUID vehicleId,
            @Valid @RequestBody VehicleRequest request,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                vehicleService.updateVehicle(
                        vehicleId,
                        request,
                        user
                )
        );
    }


    @DeleteMapping("/{vehicleId}")
    public ResponseEntity<String> deleteVehicle(
            @PathVariable UUID vehicleId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        vehicleService.deleteVehicle(
                vehicleId,
                user
        );

        return ResponseEntity.ok(
                "Vehicle deleted successfully"
        );
    }
}