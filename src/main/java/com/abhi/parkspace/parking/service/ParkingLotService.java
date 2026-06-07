package com.abhi.parkspace.parking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.request.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.response.ParkingLotResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingLotService {

    ParkingLotResponse createParkingLot(
            ParkingLotRequest request,
            User admin
    );

    List<ParkingLotResponse> getAllParkingLots();

    ParkingLotResponse getParkingLotById(
            UUID parkingLotId
    );

    List<ParkingLotResponse> getParkingLotsByCity(
            String city
    );

    List<ParkingLotResponse> getAdminParkingLots(
            User admin
    );

    ParkingLotResponse updateParkingLot(
            UUID parkingLotId,
            ParkingLotRequest request,
            User admin
    );

    void deleteParkingLot(
            UUID parkingLotId,
            User admin
    );
}