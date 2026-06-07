package com.abhi.parkspace.parking.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingLotResponse;
import com.abhi.parkspace.parking.service.ParkingLotService;
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
@RequestMapping("/api/v1/parking-lots")
@RequiredArgsConstructor
public class ParkingLotController {

    private final ParkingLotService parkingLotService;

    /*
     =========================================
              CREATE PARKING LOT
     =========================================
     */

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingLotResponse> createParkingLot(
            @Valid @RequestBody ParkingLotRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        parkingLotService.createParkingLot(
                                request,
                                admin
                        )
                );
    }

    /*
     =========================================
              GET ALL PARKING LOTS
     =========================================
     */

    @GetMapping
    public ResponseEntity<List<ParkingLotResponse>>
    getAllParkingLots() {

        return ResponseEntity.ok(
                parkingLotService.getAllParkingLots()
        );
    }

    /*
     =========================================
              GET PARKING LOT BY ID
     =========================================
     */

    @GetMapping("/{parkingLotId}")
    public ResponseEntity<ParkingLotResponse>
    getParkingLotById(
            @PathVariable UUID parkingLotId
    ) {

        return ResponseEntity.ok(
                parkingLotService.getParkingLotById(
                        parkingLotId
                )
        );
    }

    /*
     =========================================
              GET PARKING LOTS BY CITY
     =========================================
     */

    @GetMapping("/city/{city}")
    public ResponseEntity<List<ParkingLotResponse>>
    getParkingLotsByCity(
            @PathVariable String city
    ) {

        return ResponseEntity.ok(
                parkingLotService.getParkingLotsByCity(city)
        );
    }

    /*
     =========================================
              GET ADMIN PARKING LOTS
     =========================================
     */

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ParkingLotResponse>>
    getAdminParkingLots(
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                parkingLotService.getAdminParkingLots(
                        admin
                )
        );
    }

    /*
     =========================================
              UPDATE PARKING LOT
     =========================================
     */

    @PutMapping("/{parkingLotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ParkingLotResponse>
    updateParkingLot(
            @PathVariable UUID parkingLotId,
            @Valid @RequestBody ParkingLotRequest request,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                parkingLotService.updateParkingLot(
                        parkingLotId,
                        request,
                        admin
                )
        );
    }

    /*
     =========================================
              DELETE PARKING LOT
     =========================================
     */

    @DeleteMapping("/{parkingLotId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteParkingLot(
            @PathVariable UUID parkingLotId,
            Authentication authentication
    ) {

        User admin =
                (User) authentication.getPrincipal();

        parkingLotService.deleteParkingLot(
                parkingLotId,
                admin
        );

        return ResponseEntity.ok(
                "Parking lot deleted successfully"
        );
    }
}