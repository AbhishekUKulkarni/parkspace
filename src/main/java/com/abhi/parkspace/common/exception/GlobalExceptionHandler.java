package com.abhi.parkspace.common.exception;

import com.abhi.parkspace.auth.exception.UserAlreadyExistsException;
import com.abhi.parkspace.booking.exception.BookingConflictException;
import com.abhi.parkspace.booking.exception.BookingNotFoundException;
import com.abhi.parkspace.booking.exception.BookingOwnershipException;
import com.abhi.parkspace.common.response.ApiErrorResponse;
import com.abhi.parkspace.parking.exception.ParkingSpotUnavailableException;
import com.abhi.parkspace.payment.exception.PaymentAlreadyExistsException;
import com.abhi.parkspace.payment.exception.PaymentNotFoundException;
import com.abhi.parkspace.vehicle.exception.VehicleNotFoundException;
import com.abhi.parkspace.vehicle.exception.VehicleOwnershipException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     =========================================
                GENERIC EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>
    handleResourceNotFoundException(
            ResourceNotFoundException ex
    ) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "NOT_FOUND",
                ex.getMessage()
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiErrorResponse>
    handleBadRequestException(
            BadRequestException ex
    ) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "BAD_REQUEST",
                ex.getMessage()
        );
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiErrorResponse>
    handleUnauthorizedException(
            UnauthorizedException ex
    ) {

        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "UNAUTHORIZED",
                ex.getMessage()
        );
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse>
    handleBadCredentialsException(
            BadCredentialsException ex
    ) {

        return buildErrorResponse(
                HttpStatus.UNAUTHORIZED,
                "INVALID_CREDENTIALS",
                "Invalid email or password"
        );
    }

    /*
     =========================================
                  AUTH EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse>
    handleUserAlreadyExistsException(
            UserAlreadyExistsException ex
    ) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "USER_ALREADY_EXISTS",
                ex.getMessage()
        );
    }

    /*
     =========================================
                VEHICLE EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(VehicleNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>
    handleVehicleNotFoundException(
            VehicleNotFoundException ex
    ) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "VEHICLE_NOT_FOUND",
                ex.getMessage()
        );
    }

    @ExceptionHandler(VehicleOwnershipException.class)
    public ResponseEntity<ApiErrorResponse>
    handleVehicleOwnershipException(
            VehicleOwnershipException ex
    ) {

        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "VEHICLE_ACCESS_DENIED",
                ex.getMessage()
        );
    }

    /*
     =========================================
                BOOKING EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(BookingNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>
    handleBookingNotFoundException(
            BookingNotFoundException ex
    ) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "BOOKING_NOT_FOUND",
                ex.getMessage()
        );
    }

    @ExceptionHandler(BookingConflictException.class)
    public ResponseEntity<ApiErrorResponse>
    handleBookingConflictException(
            BookingConflictException ex
    ) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "BOOKING_CONFLICT",
                ex.getMessage()
        );
    }

    @ExceptionHandler(BookingOwnershipException.class)
    public ResponseEntity<ApiErrorResponse>
    handleBookingOwnershipException(
            BookingOwnershipException ex
    ) {

        return buildErrorResponse(
                HttpStatus.FORBIDDEN,
                "BOOKING_ACCESS_DENIED",
                ex.getMessage()
        );
    }

    /*
     =========================================
                PARKING EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(
            ParkingSpotUnavailableException.class
    )
    public ResponseEntity<ApiErrorResponse>
    handleParkingSpotUnavailableException(
            ParkingSpotUnavailableException ex
    ) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "PARKING_SPOT_UNAVAILABLE",
                ex.getMessage()
        );
    }

    /*
     =========================================
                PAYMENT EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<ApiErrorResponse>
    handlePaymentNotFoundException(
            PaymentNotFoundException ex
    ) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                "PAYMENT_NOT_FOUND",
                ex.getMessage()
        );
    }

    @ExceptionHandler(PaymentAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse>
    handlePaymentAlreadyExistsException(
            PaymentAlreadyExistsException ex
    ) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                "PAYMENT_ALREADY_EXISTS",
                ex.getMessage()
        );
    }

    /*
     =========================================
                VALIDATION EXCEPTIONS
     =========================================
     */

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, String>>
    handleValidationExceptions(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->

                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .badRequest()
                .body(errors);
    }

    /*
     =========================================
                GLOBAL EXCEPTION
     =========================================
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse>
    handleGlobalException(
            Exception ex
    ) {

        return buildErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "INTERNAL_SERVER_ERROR",
                ex.getMessage()
        );
    }

    /*
     =========================================
                HELPER METHOD
     =========================================
     */

    private ResponseEntity<ApiErrorResponse>
    buildErrorResponse(
            HttpStatus status,
            String error,
            String message
    ) {

        ApiErrorResponse response =
                new ApiErrorResponse(
                        status.value(),
                        error,
                        message,
                        LocalDateTime.now()
                );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}