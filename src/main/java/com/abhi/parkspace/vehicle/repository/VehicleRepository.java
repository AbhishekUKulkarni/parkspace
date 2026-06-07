package com.abhi.parkspace.vehicle.repository;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository
        extends JpaRepository<Vehicle, UUID> {

    List<Vehicle> findByOwner(User owner);

    Optional<Vehicle> findByIdAndOwner(
            UUID id,
            User owner
    );

    boolean existsByVehicleNumber(String vehicleNumber);
}