package com.abhi.parkspace.vehicle.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.vehicle.dto.request.VehicleRequest;
import com.abhi.parkspace.vehicle.dto.response.VehicleResponse;

import java.util.List;
import java.util.UUID;

public interface VehicleService {

    VehicleResponse createVehicle(
            VehicleRequest request,
            User user
    );

    List<VehicleResponse> getUserVehicles(User user);

    VehicleResponse getVehicleById(
            UUID vehicleId,
            User user
    );

    VehicleResponse updateVehicle(
            UUID vehicleId,
            VehicleRequest request,
            User user
    );

    void deleteVehicle(
            UUID vehicleId,
            User user
    );
}