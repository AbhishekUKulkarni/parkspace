package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.parking.entity.ParkingFloor;
import com.abhi.parkspace.parking.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParkingFloorRepository
        extends JpaRepository<ParkingFloor, UUID> {

    List<ParkingFloor> findByParkingLot(
            ParkingLot parkingLot
    );

    Optional<ParkingFloor> findByIdAndParkingLot(
            UUID id,
            ParkingLot parkingLot
    );

    boolean existsByFloorNumberAndParkingLot(
            Integer floorNumber,
            ParkingLot parkingLot
    );
}