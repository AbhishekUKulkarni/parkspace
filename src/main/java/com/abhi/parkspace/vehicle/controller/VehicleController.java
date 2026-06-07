package com.abhi.parkspace.vehicle.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.vehicle.dto.request.VehicleRequest;
import com.abhi.parkspace.vehicle.dto.response.VehicleResponse;
import com.abhi.parkspace.vehicle.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vehicles")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class VehicleController {

    private final VehicleService vehicleService;

    /*
     =========================================
              CREATE VEHICLE
     =========================================
     */

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

    /*
     =========================================
              GET ALL USER VEHICLES
     =========================================
     */

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

    /*
     =========================================
              GET VEHICLE BY ID
     =========================================
     */

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

    /*
     =========================================
              UPDATE VEHICLE
     =========================================
     */

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

    /*
     =========================================
              DELETE VEHICLE
     =========================================
     */

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