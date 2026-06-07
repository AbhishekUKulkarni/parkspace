package com.abhi.parkspace.booking.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.dto.request.CreateBookingRequest;
import com.abhi.parkspace.booking.dto.request.UpdateBookingStatusRequest;
import com.abhi.parkspace.booking.dto.response.BookingResponse;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.booking.enums.PaymentStatus;
import com.abhi.parkspace.booking.exception.BookingConflictException;
import com.abhi.parkspace.booking.exception.BookingNotFoundException;
import com.abhi.parkspace.booking.exception.BookingOwnershipException;
import com.abhi.parkspace.booking.repository.BookingRepository;
import com.abhi.parkspace.booking.service.BookingService;
import com.abhi.parkspace.common.exception.BadRequestException;
import com.abhi.parkspace.parking.entity.ParkingSpot;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.parking.exception.ParkingSpotNotFoundException;
import com.abhi.parkspace.parking.exception.ParkingSpotUnavailableException;
import com.abhi.parkspace.parking.repository.ParkingSpotRepository;
import com.abhi.parkspace.vehicle.entity.Vehicle;
import com.abhi.parkspace.vehicle.exception.VehicleNotFoundException;
import com.abhi.parkspace.vehicle.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class BookingServiceImpl
        implements BookingService {

    private final BookingRepository bookingRepository;

    private final VehicleRepository vehicleRepository;

    private final ParkingSpotRepository parkingSpotRepository;

    @Override
    public BookingResponse createBooking(
            CreateBookingRequest request,
            User user
    ) {

        Vehicle vehicle =
                getVehicle(
                        request.vehicleId(),
                        user
                );

        ParkingSpot parkingSpot =
                getParkingSpot(
                        request.parkingSpotId()
                );

        validateSpotAvailability(parkingSpot);

        validateBookingTime(
                request.startTime(),
                request.endTime()
        );

        validateBookingConflict(
                parkingSpot,
                request.startTime(),
                request.endTime()
        );

        BigDecimal totalAmount =
                calculateTotalAmount(
                        request.startTime(),
                        request.endTime()
                );

        Booking booking = Booking.builder()
                .bookingNumber(
                        generateBookingNumber()
                )
                .user(user)
                .vehicle(vehicle)
                .parkingSpot(parkingSpot)

                 //  WAITING FOR PAYMENT


                .bookingStatus(
                        BookingStatus.PENDING
                )

                .paymentStatus(
                        PaymentStatus.PENDING
                )

                .startTime(request.startTime())
                .endTime(request.endTime())

                .hourlyRate(
                        BigDecimal.valueOf(100)
                )

                .totalAmount(totalAmount)

                .active(true)
                .build();

        Booking savedBooking =
                bookingRepository.save(booking);

        log.info(
                "Booking created: {}",
                savedBooking.getBookingNumber()
        );

        return mapToResponse(savedBooking);
    }

    @Override
    public List<BookingResponse> getUserBookings(
            User user
    ) {

        return bookingRepository.findByUser(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public BookingResponse getBookingById(
            UUID bookingId,
            User user
    ) {

        Booking booking =
                getBooking(bookingId);

        validateBookingOwnership(
                booking,
                user
        );

        return mapToResponse(booking);
    }

    @Override
    public BookingResponse updateBookingStatus(
            UUID bookingId,
            UpdateBookingStatusRequest request,
            User user
    ) {

        Booking booking =
                getBooking(bookingId);

        validateBookingOwnership(
                booking,
                user
        );

        BookingStatus status =
                request.bookingStatus();

        booking.setBookingStatus(status);

        if (status == BookingStatus.ACTIVE) {

            booking.setCheckInTime(
                    LocalDateTime.now()
            );

            booking.getParkingSpot()
                    .setStatus(
                            ParkingSpotStatus.OCCUPIED
                    );
        }

        if (status == BookingStatus.COMPLETED) {

            booking.setCheckOutTime(
                    LocalDateTime.now()
            );

            booking.getParkingSpot()
                    .setStatus(
                            ParkingSpotStatus.AVAILABLE
                    );

            booking.setActive(false);
        }

        if (
                status == BookingStatus.CANCELLED
                        || status == BookingStatus.EXPIRED
        ) {

            booking.getParkingSpot()
                    .setStatus(
                            ParkingSpotStatus.AVAILABLE
                    );

            booking.setActive(false);
        }

        Booking updatedBooking =
                bookingRepository.save(booking);

        parkingSpotRepository.save(
                booking.getParkingSpot()
        );

        log.info(
                "Booking status updated: {} -> {}",
                booking.getBookingNumber(),
                status
        );

        return mapToResponse(updatedBooking);
    }

    @Override
    public void cancelBooking(
            UUID bookingId,
            User user
    ) {

        Booking booking =
                getBooking(bookingId);

        validateBookingOwnership(
                booking,
                user
        );

        if (
                booking.getBookingStatus()
                        == BookingStatus.CANCELLED
        ) {

            throw new BadRequestException(
                    "Booking already cancelled"
            );
        }

        booking.setBookingStatus(
                BookingStatus.CANCELLED
        );

        booking.setActive(false);

        booking.getParkingSpot()
                .setStatus(
                        ParkingSpotStatus.AVAILABLE
                );

        bookingRepository.save(booking);

        parkingSpotRepository.save(
                booking.getParkingSpot()
        );

        log.info(
                "Booking cancelled: {}",
                booking.getBookingNumber()
        );
    }

    /*
     =========================================
                HELPER METHODS
     =========================================
     */

    private Booking getBooking(
            UUID bookingId
    ) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() ->
                        new BookingNotFoundException(
                                "Booking not found"
                        )
                );
    }

    private Vehicle getVehicle(
            UUID vehicleId,
            User user
    ) {

        return vehicleRepository
                .findByIdAndOwner(
                        vehicleId,
                        user
                )
                .orElseThrow(() ->
                        new VehicleNotFoundException(
                                "Vehicle not found"
                        )
                );
    }

    private ParkingSpot getParkingSpot(
            UUID parkingSpotId
    ) {

        return parkingSpotRepository.findById(
                parkingSpotId
        ).orElseThrow(() ->
                new ParkingSpotNotFoundException(
                        "Parking spot not found"
                )
        );
    }

    private void validateSpotAvailability(
            ParkingSpot parkingSpot
    ) {

        if (
                parkingSpot.getStatus()
                        != ParkingSpotStatus.AVAILABLE
        ) {

            throw new ParkingSpotUnavailableException(
                    "Parking spot is not available"
            );
        }
    }

    private void validateBookingTime(
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {

        if (endTime.isBefore(startTime)) {

            throw new BadRequestException(
                    "End time must be after start time"
            );
        }
    }

    private void validateBookingConflict(
            ParkingSpot parkingSpot,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {

        boolean conflictExists =
                bookingRepository
                        .existsByParkingSpotAndBookingStatusInAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                                parkingSpot,
                                List.of(
                                        BookingStatus.PENDING,
                                        BookingStatus.CONFIRMED,
                                        BookingStatus.ACTIVE
                                ),
                                endTime,
                                startTime
                        );

        if (conflictExists) {

            throw new BookingConflictException(
                    "Parking spot already booked for this time"
            );
        }
    }

    private void validateBookingOwnership(
            Booking booking,
            User user
    ) {

        if (
                !booking.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new BookingOwnershipException(
                    "You are not authorized"
            );
        }
    }

    private BigDecimal calculateTotalAmount(
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {

        long durationHours =
                Math.max(
                        1,
                        Duration.between(
                                startTime,
                                endTime
                        ).toHours()
                );

        BigDecimal hourlyRate =
                BigDecimal.valueOf(100);

        return hourlyRate.multiply(
                BigDecimal.valueOf(durationHours)
        );
    }

    private String generateBookingNumber() {

        return "PS-BOOK-"
                + System.currentTimeMillis();
    }

    private BookingResponse mapToResponse(
            Booking booking
    ) {

        return new BookingResponse(
                booking.getId(),
                booking.getBookingNumber(),
                booking.getUser().getEmail(),
                booking.getVehicle()
                        .getVehicleNumber(),
                booking.getParkingSpot()
                        .getSpotNumber(),
                booking.getBookingStatus(),
                booking.getPaymentStatus(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getCheckInTime(),
                booking.getCheckOutTime(),
                booking.getHourlyRate(),
                booking.getTotalAmount(),
                booking.getActive(),
                booking.getCreatedAt()
        );
    }
}