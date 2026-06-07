package com.abhi.parkspace.payment.service.impl;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.booking.exception.BookingNotFoundException;
import com.abhi.parkspace.booking.exception.BookingOwnershipException;
import com.abhi.parkspace.booking.repository.BookingRepository;
import com.abhi.parkspace.parking.enums.ParkingSpotStatus;
import com.abhi.parkspace.payment.dto.request.CreatePaymentRequest;
import com.abhi.parkspace.payment.dto.response.PaymentResponse;
import com.abhi.parkspace.payment.entity.Payment;
import com.abhi.parkspace.payment.enums.PaymentStatus;
import com.abhi.parkspace.payment.exception.PaymentAlreadyExistsException;
import com.abhi.parkspace.payment.exception.PaymentNotFoundException;
import com.abhi.parkspace.payment.exception.PaymentRefundException;
import com.abhi.parkspace.payment.repository.PaymentRepository;
import com.abhi.parkspace.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PaymentServiceImpl
        implements PaymentService {

    private final PaymentRepository
            paymentRepository;

    private final BookingRepository
            bookingRepository;

    @Override
    public PaymentResponse createPayment(
            CreatePaymentRequest request,
            User user
    ) {

        Booking booking =
                getBooking(
                        request.bookingId()
                );

        validateBookingOwnership(
                booking,
                user
        );

        validatePaymentDoesNotExist(
                booking
        );

        Payment payment = Payment.builder()
                .transactionId(
                        generateTransactionId()
                )
                .booking(booking)
                .paymentMethod(
                        request.paymentMethod()
                )
                .paymentStatus(
                        PaymentStatus.SUCCESS
                )
                .amount(
                        booking.getTotalAmount()
                )
                .paidAt(LocalDateTime.now())
                .active(true)
                .build();

        Payment savedPayment =
                paymentRepository.save(payment);

        /*
         =====================================
                BOOKING CONFIRMED
         =====================================
         */

        booking.setPaymentStatus(
                com.abhi.parkspace.booking.enums
                        .PaymentStatus.PAID
        );

        booking.setBookingStatus(
                BookingStatus.CONFIRMED
        );

        /*
         =====================================
                RESERVE SPOT
         =====================================
         */

        booking.getParkingSpot()
                .setStatus(
                        ParkingSpotStatus.RESERVED
                );

        bookingRepository.save(booking);

        log.info(
                "Payment successful for booking: {}",
                booking.getBookingNumber()
        );

        return mapToResponse(savedPayment);
    }

    @Override
    public List<PaymentResponse> getUserPayments(
            User user
    ) {

        return bookingRepository.findByUser(user)
                .stream()
                .map(paymentRepository::findByBooking)
                .filter(Optional -> Optional.isPresent())
                .map(Optional::get)
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public PaymentResponse getPaymentById(
            UUID paymentId,
            User user
    ) {

        Payment payment =
                getPayment(paymentId);

        validateBookingOwnership(
                payment.getBooking(),
                user
        );

        return mapToResponse(payment);
    }

    @Override
    public PaymentResponse refundPayment(
            UUID paymentId
    ) {

        Payment payment =
                getPayment(paymentId);

        if (
                payment.getPaymentStatus()
                        == PaymentStatus.REFUNDED
        ) {

            throw new PaymentRefundException(
                    "Payment already refunded"
            );
        }

        payment.setPaymentStatus(
                PaymentStatus.REFUNDED
        );

        payment.setRefundedAt(
                LocalDateTime.now()
        );

        payment.setActive(false);

        Booking booking =
                payment.getBooking();

        booking.setPaymentStatus(
                com.abhi.parkspace.booking.enums
                        .PaymentStatus.REFUNDED
        );

        booking.setBookingStatus(
                BookingStatus.CANCELLED
        );

        booking.setActive(false);

        /*
         =====================================
                RELEASE PARKING SPOT
         =====================================
         */

        booking.getParkingSpot()
                .setStatus(
                        ParkingSpotStatus.AVAILABLE
                );

        Payment updatedPayment =
                paymentRepository.save(payment);

        bookingRepository.save(booking);

        log.info(
                "Payment refunded: {}",
                payment.getTransactionId()
        );

        return mapToResponse(updatedPayment);
    }

    /*
     =========================================
                HELPER METHODS
     =========================================
     */

    private Booking getBooking(
            UUID bookingId
    ) {

        return bookingRepository.findById(
                bookingId
        ).orElseThrow(() ->
                new BookingNotFoundException(
                        "Booking not found"
                )
        );
    }

    private Payment getPayment(
            UUID paymentId
    ) {

        return paymentRepository.findById(
                paymentId
        ).orElseThrow(() ->
                new PaymentNotFoundException(
                        "Payment not found"
                )
        );
    }

    private void validatePaymentDoesNotExist(
            Booking booking
    ) {

        if (
                paymentRepository.findByBooking(booking)
                        .isPresent()
        ) {

            throw new PaymentAlreadyExistsException(
                    "Payment already exists for this booking"
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

    private String generateTransactionId() {

        return "PS-PAY-"
                + System.currentTimeMillis();
    }

    private PaymentResponse mapToResponse(
            Payment payment
    ) {

        return new PaymentResponse(
                payment.getId(),
                payment.getTransactionId(),
                payment.getBooking()
                        .getBookingNumber(),
                payment.getPaymentMethod(),
                payment.getPaymentStatus(),
                payment.getAmount(),
                payment.getPaidAt(),
                payment.getRefundedAt(),
                payment.getActive(),
                payment.getCreatedAt()
        );
    }
}