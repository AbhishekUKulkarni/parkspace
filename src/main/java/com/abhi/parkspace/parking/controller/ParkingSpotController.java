package com.abhi.parkspace.parking.controller;

import com.abhi.parkspace.parking.dto.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.ParkingSpotResponse;
import com.abhi.parkspace.parking.service.ParkingSpotService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/spots")
@RequiredArgsConstructor
public class ParkingSpotController {

    private final ParkingSpotService service;

    @PostMapping("/{lotId}")
    public ParkingSpotResponse create(
            @PathVariable UUID lotId,
            @RequestBody ParkingSpotRequest request
    ) {
        return service.create(lotId, request);
    }

    @GetMapping("/{lotId}")
    public List<ParkingSpotResponse> getByLot(
            @PathVariable UUID lotId
    ) {
        return service.getByLot(lotId);
    }

    @PutMapping("/{spotId}")
    public ParkingSpotResponse update(
            @PathVariable UUID spotId,
            @RequestBody ParkingSpotRequest request
    ) {
        return service.update(spotId, request);
    }

    @DeleteMapping("/{spotId}")
    public void delete(
            @PathVariable UUID spotId
    ) {
        service.delete(spotId);
    }
}