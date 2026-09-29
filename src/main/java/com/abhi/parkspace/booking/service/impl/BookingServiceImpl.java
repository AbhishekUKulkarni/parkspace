package com.abhi.parkspace.booking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.BookingRequest;
import com.abhi.parkspace.booking.dto.BookingResponse;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.booking.repository.BookingRepository;
import com.abhi.parkspace.booking.service.BookingService;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.repository.ParkingSpotRepository;
import com.abhi.parkspace.vehicle.entity.Vehicle;
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

    @Override
    public BookingResponse createBooking(BookingRequest request, User user){

        Vehicle vehicle = vehicleRepository
                .findByIdAndOwner(request.vehicleId(), user)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        bookingRepository
                .findByVehicleIdAndStatus(request.vehicleId(), BookingStatus.ACTIVE)
                .ifPresent(b -> {
                    throw new RuntimeException("Active booking already exists");
                });

        ParkingSpot spot = parkingSpotRepository
                .findFirstByStatusOrderById(ParkingSpotStatus.AVAILABLE)
                .orElseThrow(() -> new RuntimeException("No parking available"));



        spot.occupy();
        log.info("Allocating spot {}", spot.getId());
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
                    throw new RuntimeException("Unauthorized");
                }

                if (booking.getStatus() != BookingStatus.ACTIVE) {
                    throw new RuntimeException("Already closed");
                }

                booking.setStatus(BookingStatus.COMPLETED);
                booking.setEndTime(Instant.now());

                ParkingSpot spot = booking.getParkingSpot();
                spot.free();

                bookingRepository.save(booking);
                return;

            } catch (ObjectOptimisticLockingFailureException ex) {
                if (retry == 0) {
                    throw new RuntimeException("Failed to end booking");
                }
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public BookingResponse getActiveBooking(UUID vehicleId, User owner) {

        Vehicle vehicle = vehicleRepository
                .findByIdAndOwner(vehicleId, owner)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Booking booking = bookingRepository
                .findByVehicleIdAndStatus(vehicle.getId(), BookingStatus.ACTIVE)
                .orElseThrow(() -> new RuntimeException("No active booking"));

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