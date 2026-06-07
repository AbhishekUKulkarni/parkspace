package com.abhi.parkspace.booking.dto.response;

import com.abhi.parkspace.booking.enums.BookingStatus;
import com.abhi.parkspace.booking.enums.PaymentStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record BookingResponse(

        UUID id,

        String bookingNumber,

        String userEmail,

        String vehicleNumber,

        String parkingSpotNumber,

        BookingStatus bookingStatus,

        PaymentStatus paymentStatus,

        LocalDateTime startTime,

        LocalDateTime endTime,

        LocalDateTime checkInTime,

        LocalDateTime checkOutTime,

        BigDecimal hourlyRate,

        BigDecimal totalAmount,

        Boolean active,

        LocalDateTime createdAt
) {
}