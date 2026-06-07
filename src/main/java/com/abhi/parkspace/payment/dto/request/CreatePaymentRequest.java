package com.abhi.parkspace.payment.dto.request;

import com.abhi.parkspace.payment.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CreatePaymentRequest(

        @NotNull(message = "Booking id is required")
        UUID bookingId,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod
) {
}