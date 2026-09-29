package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {


    List<ParkingSpot> findByParkingLotId(UUID parkingLotId);




    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<ParkingSpot> findFirstByStatusOrderById(ParkingSpotStatus status);

 }