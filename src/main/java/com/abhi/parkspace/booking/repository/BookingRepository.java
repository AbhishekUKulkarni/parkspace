package com.abhi.parkspace.booking.repository;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookingRepository
        extends JpaRepository<Booking, UUID> {

    List<Booking> findByUser(User user);
    List<Booking> findByBookingStatusAndStartTimeBefore(
            BookingStatus bookingStatus,
            LocalDateTime time
    );
    List<Booking> findByBookingStatus(
            BookingStatus bookingStatus
    );

    List<Booking> findByParkingSpot(
            ParkingSpot parkingSpot
    );

    List<Booking> findByVehicle(
            Vehicle vehicle
    );

    Optional<Booking> findByBookingNumber(
            String bookingNumber
    );

    boolean existsByParkingSpotAndBookingStatusInAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            ParkingSpot parkingSpot,
            List<BookingStatus> statuses,
            LocalDateTime endTime,
            LocalDateTime startTime
    );
}