package com.abhi.parkspace.booking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.BookingRequest;
import com.abhi.parkspace.booking.dto.BookingResponse;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.booking.exception.*;
import com.abhi.parkspace.booking.repository.BookingRepository;
import com.abhi.parkspace.booking.service.BookingService;
import com.abhi.parkspace.common.exception.UnauthorizedException;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.exception.ParkingSpotNotFoundException;
import com.abhi.parkspace.parking.repository.ParkingLotRepository;
import com.abhi.parkspace.parking.repository.ParkingSpotRepository;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import com.abhi.parkspace.vehicle.exception.VehicleNotFoundException;
import com.abhi.parkspace.vehicle.repository.VehicleRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final ParkingSpotRepository parkingSpotRepository;
    private final ParkingLotRepository parkingLotRepository;
    @Override
    public BookingResponse createBooking(BookingRequest request, User user) {

        // 1. Validate that the vehicle belongs to the authenticated user
        Vehicle vehicle = vehicleRepository
                .findByIdAndOwner(request.vehicleId(), user)
                .orElseThrow(() ->
                        new VehicleNotFoundException("Vehicle not found"));

        // 2. Prevent the vehicle from having another active booking
        bookingRepository
                .findByVehicleIdAndStatus(
                        request.vehicleId(),
                        BookingStatus.ACTIVE
                )
                .ifPresent(booking -> {
                    throw new RuntimeException(
                            "Active booking already exists for this vehicle"
                    );
                });

        // 3. Verify that the parking lot exists
        parkingLotRepository.findById(request.lotId())
                .orElseThrow(() ->
                        new RuntimeException("Parking lot not found"));

        // 4. Lock the exact spot selected by the user
        ParkingSpot spot = parkingSpotRepository
                .findByIdForUpdate(request.parkingSpotId())
                .orElseThrow(() ->
                        new ParkingSpotNotFoundException("Parking spot not found"));

        // 5. Verify that the selected spot belongs to the requested lot
        if (!spot.getParkingLot().getId().equals(request.lotId())) {
            throw new RuntimeException(
                    "Selected parking spot does not belong to this lot"
            );
        }

        // 6. Verify that the selected spot is available
        if (spot.getStatus() != ParkingSpotStatus.AVAILABLE) {
            throw new RuntimeException(
                    "Selected parking spot is no longer available"
            );
        }

        // 7. Mark the selected spot as occupied
        spot.occupy();
        parkingSpotRepository.save(spot);

        // 8. Create the booking
        Booking booking = Booking.builder()
                .vehicle(vehicle)
                .parkingSpot(spot)
                .status(BookingStatus.ACTIVE)
                .startTime(Instant.now())
                .build();

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);
    }

    @Override
    public void endBooking(UUID bookingId, User user) {

        int retry = 3;

        while (retry-- > 0) {
            try {
                Booking booking = bookingRepository.findById(bookingId)
                        .orElseThrow(() -> new RuntimeException("Booking not found"));

                if (!booking.getVehicle().getOwner().getId().equals(user.getId())) {
                    throw new UnauthorizedException("Unauthorized");
                }

                if (booking.getStatus() != BookingStatus.ACTIVE) {
                    throw new BookingExpiredException("Already closed");
                }

                booking.setStatus(BookingStatus.COMPLETED);
                booking.setEndTime(Instant.now());

                ParkingSpot spot = booking.getParkingSpot();
                spot.free();

                bookingRepository.save(booking);
                return;

            } catch (ObjectOptimisticLockingFailureException ex) {
                if (retry == 0) {
                    throw new FailedToEndBooking("Failed to end booking");
                }
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getActiveBooking(UUID vehicleId, User owner) {

        Vehicle vehicle = vehicleRepository
                .findByIdAndOwner(vehicleId, owner)
                .orElseThrow(() -> new VehicleNotFoundException("Vehicle not found"));

        Booking booking = bookingRepository
                .findByVehicleIdAndStatus(vehicle.getId(), BookingStatus.ACTIVE)
                .orElseThrow(() -> new BookingNotFoundException("No active booking"));

        return mapToResponse(booking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponse> getUserBookings(User owner) {

        return bookingRepository.findByVehicleOwner(owner)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private BookingResponse mapToResponse(Booking b) {
        return new BookingResponse(
                b.getId(),
                b.getVehicle().getId(),
                b.getParkingSpot().getId(),
                b.getStatus(),
                b.getStartTime(),
                b.getEndTime()
        );
    }
}