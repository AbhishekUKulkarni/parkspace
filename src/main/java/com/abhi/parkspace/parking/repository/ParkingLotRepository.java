package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.entity.ParkingLot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ParkingLotRepository extends JpaRepository<ParkingLot, UUID> {

    List<ParkingLot> findByAdmin(User admin);

    List<ParkingLot> findByActiveTrue();

    @Query("""
        SELECT lot
        FROM ParkingLot lot
        WHERE lot.active = true
        AND (
            LOWER(lot.name) LIKE LOWER(CONCAT('%', :location, '%'))
            OR LOWER(lot.address) LIKE LOWER(CONCAT('%', :location, '%'))
        )
    """)
    List<ParkingLot> searchActiveLots(@Param("location") String location);
}