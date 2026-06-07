package com.abhi.parkspace.booking.exception;

public class BookingConflictException  extends RuntimeException {
    public BookingConflictException(String message) {
        super(message);
    }
}
