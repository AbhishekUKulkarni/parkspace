package com.abhi.parkspace.parking.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingSpotResponse;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;
import com.abhi.parkspace.parking.service.ParkingSpotService;
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
@RequestMapping("/api/v1/parking-lots/{parkingLotId}/floors/{floorId}/spots")
@RequiredArgsConstructor
public class ParkingSpotController {

    private final ParkingSpotService parkingSpotService;

    /*
     =========================================
              CREATE PARKING SPOT
     =========================================
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingSpotResponse>
    createParkingSpot(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            @Valid @RequestBody ParkingSpotRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        parkingSpotService.createParkingSpot(
                                parkingLotId,
                                floorId,
                                request,
                                admin
                        )
                );
    }

    /*
     =========================================
              GET ALL PARKING SPOTS
     =========================================
     */

    @GetMapping
    public ResponseEntity<List<ParkingSpotResponse>>
    getFloorParkingSpots(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId
    ) {

        return ResponseEntity.ok(
                parkingSpotService.getFloorParkingSpots(
                        parkingLotId,
                        floorId
                )
        );
    }

    /*
     =========================================
              GET PARKING SPOT BY ID
     =========================================
     */

    @GetMapping("/{spotId}")
    public ResponseEntity<ParkingSpotResponse>
    getParkingSpotById(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            @PathVariable UUID spotId
    ) {

        return ResponseEntity.ok(
                parkingSpotService.getParkingSpotById(
                        parkingLotId,
                        floorId,
                        spotId
                )
        );
    }

    /*
     =========================================
              GET PARKING SPOTS BY STATUS
     =========================================
     */

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ParkingSpotResponse>>
    getParkingSpotsByStatus(
            @PathVariable ParkingSpotStatus status
    ) {

        return ResponseEntity.ok(
                parkingSpotService.getParkingSpotsByStatus(
                        status
                )
        );
    }

    /*
     =========================================
              GET PARKING SPOTS BY TYPE
     =========================================
     */

    @GetMapping("/type/{type}")
    public ResponseEntity<List<ParkingSpotResponse>>
    getParkingSpotsByType(
            @PathVariable ParkingSpotType type
    ) {

        return ResponseEntity.ok(
                parkingSpotService.getParkingSpotsByType(
                        type
                )
        );
    }

    /*
     =========================================
              UPDATE PARKING SPOT
     =========================================
     */

    @PutMapping("/{spotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingSpotResponse>
    updateParkingSpot(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            @PathVariable UUID spotId,
            @Valid @RequestBody ParkingSpotRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                parkingSpotService.updateParkingSpot(
                        parkingLotId,
                        floorId,
                        spotId,
                        request,
                        admin
                )
        );
    }

    /*
     =========================================
              DELETE PARKING SPOT
     =========================================
     */

    @DeleteMapping("/{spotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteParkingSpot(
            @PathVariable UUID parkingLotId,
            @PathVariable UUID floorId,
            @PathVariable UUID spotId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        parkingSpotService.deleteParkingSpot(
                parkingLotId,
                floorId,
                spotId,
                admin
        );

        return ResponseEntity.ok(
                "Parking spot deleted successfully"
        );
    }
}