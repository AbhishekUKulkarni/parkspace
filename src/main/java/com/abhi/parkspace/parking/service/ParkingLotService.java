package com.abhi.parkspace.parking.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.dto.ParkingLotRequest;
import com.abhi.parkspace.parking.dto.ParkingLotResponse;

import java.util.List;
import java.util.UUID;

public interface ParkingLotService {

    ParkingLotResponse create(ParkingLotRequest request, User admin);

     List<ParkingLotResponse> searchLots(String location);

     List<ParkingLotResponse> getAll();

    ParkingLotResponse getById(UUID lotId);

    List<ParkingLotResponse> getMyLots(User admin);

    ParkingLotResponse update(UUID lotId, ParkingLotRequest request, User admin);

    void delete(UUID lotId, User admin);
}