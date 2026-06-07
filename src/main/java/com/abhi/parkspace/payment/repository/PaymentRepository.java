package com.abhi.parkspace.payment.repository;

import com.abhi.parkspace.booking.entity.Booking;
import com.abhi.parkspace.payment.entity.Payment;
import com.abhi.parkspace.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository
        extends JpaRepository<Payment, UUID> {

    Optional<Payment> findByTransactionId(
            String transactionId
    );

    Optional<Payment> findByBooking(
            Booking booking
    );

    List<Payment> findByPaymentStatus(
            PaymentStatus paymentStatus
    );
}