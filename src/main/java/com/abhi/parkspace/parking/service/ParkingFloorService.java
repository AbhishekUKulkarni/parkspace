package com.abhi.parkspace.parking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingFloorRequest;
import com.abhi.parkspace.parking.dto.response.ParkingFloorResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingFloorService {

    ParkingFloorResponse createParkingFloor(
            UUID parkingLotId,
            ParkingFloorRequest request,
            User admin
    );

    List<ParkingFloorResponse> getParkingLotFloors(
            UUID parkingLotId
    );

    ParkingFloorResponse getParkingFloorById(
            UUID parkingLotId,
            UUID floorId
    );

    ParkingFloorResponse updateParkingFloor(
            UUID parkingLotId,
            UUID floorId,
            ParkingFloorRequest request,
            User admin
    );

    void deleteParkingFloor(
            UUID parkingLotId,
            UUID floorId,
            User admin
    );
}