package com.abhi.parkspace.booking.repository;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    Optional<Booking> findByVehicleIdAndStatus(UUID vehicleId, BookingStatus status);

    List<Booking> findByVehicleOwner(User owner);
}