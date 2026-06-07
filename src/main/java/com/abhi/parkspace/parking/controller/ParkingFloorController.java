package com.abhi.parkspace.parking.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingFloorRequest;
import com.abhi.parkspace.parking.dto.response.ParkingFloorResponse;
import com.abhi.parkspace.parking.service.ParkingFloorService;
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
@RequestMapping("/api/v1/parking-lots/{parkingLotId}/floors")
@RequiredArgsConstructor
public class ParkingFloorController {

    private final ParkingFloorService parkingFloorService;

    /*
     =========================================
              CREATE FLOOR
     =========================================
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingFloorResponse>
    createParkingFloor(
            @PathVariable UUID parkingLotId,
            @Valid @RequestBody ParkingFloorRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        parkingFloorService.createParkingFloor(
                                parkingLotId,
                                request,
                                admin
                        )
                );
    }

    /*
     =========================================
              GET ALL FLOORS
     =========================================
     */

    @GetMapping
    public ResponseEntity<List<ParkingFloorResponse>>
    getParkingLotFloors(
            @PathVariable UUID parkingLotId
    ) {

        return ResponseEntity.ok(
                parkingFloorService.getParkingLotFloors(
                        parkingLotId
                )
        );
    }

    /*
     =========================================
              GET FLOOR BY ID
     =========================================
     */

    @GetMapping("/{floorId}")
    public ResponseEntity<ParkingFloorResponse>
    getParkingFloorById(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId
    ) {

        return ResponseEntity.ok(
                parkingFloorService.getParkingFloorById(
                        parkingLotId,
                        floorId
                )
        );
    }

    /*
     =========================================
              UPDATE FLOOR
     =========================================
     */

    @PutMapping("/{floorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingFloorResponse>
    updateParkingFloor(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            @Valid @RequestBody ParkingFloorRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                parkingFloorService.updateParkingFloor(
                        parkingLotId,
                        floorId,
                        request,
                        admin
                )
        );
    }

    /*
     =========================================
              DELETE FLOOR
     =========================================
     */

    @DeleteMapping("/{floorId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteParkingFloor(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        parkingFloorService.deleteParkingFloor(
                parkingLotId,
                floorId,
                admin
        );

        return ResponseEntity.ok(
                "Parking floor deleted successfully"
        );
    }
}