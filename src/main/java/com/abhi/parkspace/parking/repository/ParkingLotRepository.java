package com.abhi.parkspace.parking.repository;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.parking.entity.ParkingLot;
import com.abhi.parkspace.parking.enums.ParkingLotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParkingLotRepository
        extends JpaRepository<ParkingLot, UUID> {

    List<ParkingLot> findByAdmin(User admin);

    List<ParkingLot> findByCityIgnoreCase(String city);

    List<ParkingLot> findByStatus(
            ParkingLotStatus status
    );

    List<ParkingLot> findByActiveTrue();

    boolean existsByNameAndAddress(
            String name,
            String address
    );
}