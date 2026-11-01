package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;
import java.util.List;


public interface ParkingSpotRepository extends JpaRepository<ParkingSpot, UUID> {


    List<ParkingSpot> findByParkingLotId(UUID parkingLotId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ParkingSpot s WHERE s.id = :spotId")
    Optional<ParkingSpot> findByIdForUpdate(
            @Param("spotId") UUID spotId
    );


    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
    SELECT ps FROM ParkingSpot ps
    WHERE ps.status = :status
    AND ps.parkingLot.id = :lotId
    ORDER BY ps.id
""")
    List<ParkingSpot> findAndLockAvailableSpotsByLot(
            ParkingSpotStatus status,
            UUID lotId
    );
 }