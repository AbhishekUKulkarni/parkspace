package com.abhi.parkspace.parking.service;

import com.abhi.parkspace.parking.dto.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.ParkingSpotResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingSpotService {

    ParkingSpotResponse create(UUID lotId, ParkingSpotRequest request);

    List<ParkingSpotResponse> getByLot(UUID lotId);

    ParkingSpotResponse update(UUID spotId, ParkingSpotRequest request);

    void delete(UUID spotId);
}