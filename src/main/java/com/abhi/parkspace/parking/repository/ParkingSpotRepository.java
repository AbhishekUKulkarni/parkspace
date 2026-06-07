package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.parking.entity.ParkingFloor;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.enums.ParkingSpotType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParkingSpotRepository
        extends JpaRepository<ParkingSpot, UUID> {

    List<ParkingSpot> findByParkingFloor(
            ParkingFloor parkingFloor
    );

    List<ParkingSpot> findByStatus(
            ParkingSpotStatus status
    );

    List<ParkingSpot> findBySpotType(
            ParkingSpotType spotType
    );

    List<ParkingSpot> findByParkingFloorAndStatus(
            ParkingFloor parkingFloor,
            ParkingSpotStatus status
    );

    Optional<ParkingSpot> findByIdAndParkingFloor(
            UUID id,
            ParkingFloor parkingFloor
    );

    boolean existsBySpotNumberAndParkingFloor(
            String spotNumber,
            ParkingFloor parkingFloor
    );
}