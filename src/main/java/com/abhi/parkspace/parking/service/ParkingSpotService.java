package com.abhi.parkspace.parking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingSpotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingSpotResponse;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;

import java.util.List;
import java.util.UUID;

public interface ParkingSpotService {

    ParkingSpotResponse createParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            ParkingSpotRequest request,
            User admin
    );

    List<ParkingSpotResponse> getFloorParkingSpots(
            UUID parkingLotId,
            UUID floorId
    );

    ParkingSpotResponse getParkingSpotById(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId
    );

    List<ParkingSpotResponse> getParkingSpotsByStatus(
            ParkingSpotStatus status
    );

    List<ParkingSpotResponse> getParkingSpotsByType(
            ParkingSpotType type
    );

    ParkingSpotResponse updateParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId,
            ParkingSpotRequest request,
            User admin
    );

    void deleteParkingSpot(
            UUID parkingLotId,
            UUID floorId,
            UUID spotId,
            User admin
    );
}