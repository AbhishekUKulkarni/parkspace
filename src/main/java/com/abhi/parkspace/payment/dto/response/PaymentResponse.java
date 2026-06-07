package com.abhi.parkspace.payment.dto.response;

import com.abhi.parkspace.payment.enums.PaymentMethod;
import com.abhi.parkspace.payment.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PaymentResponse(

        UUID id,

        String transactionId,

        String bookingNumber,

        PaymentMethod paymentMethod,

        PaymentStatus paymentStatus,

        BigDecimal amount,

        LocalDateTime paidAt,

        LocalDateTime refundedAt,

        Boolean active,

        LocalDateTime createdAt
) {
}