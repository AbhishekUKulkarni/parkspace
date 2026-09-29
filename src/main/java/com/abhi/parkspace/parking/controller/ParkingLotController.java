package com.abhi.parkspace.parking.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.ParkingLotResponse;
import com.abhi.parkspace.parking.service.ParkingLotService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/lots")
@RequiredArgsConstructor
public class ParkingLotController {

    private final ParkingLotService service;

    @PostMapping
    public ParkingLotResponse create(
            @RequestBody ParkingLotRequest request,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        return service.create(request, user);
    }

    @GetMapping
    public List<ParkingLotResponse> getAll() {
        return service.getAll();
    }

    @GetMapping("/{lotId}")
    public ParkingLotResponse getById(@PathVariable UUID lotId) {
        return service.getById(lotId);
    }

    @GetMapping("/my")
    public List<ParkingLotResponse> getMyLots(Authentication auth) {
        User user = (User) auth.getPrincipal();
        return service.getMyLots(user);
    }

    @PutMapping("/{lotId}")
    public ParkingLotResponse update(
            @PathVariable UUID lotId,
            @RequestBody ParkingLotRequest request,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        return service.update(lotId, request, user);
    }

    @DeleteMapping("/{lotId}")
    public void delete(
            @PathVariable UUID lotId,
            Authentication auth
    ) {
        User user = (User) auth.getPrincipal();
        service.delete(lotId, user);
    }
}