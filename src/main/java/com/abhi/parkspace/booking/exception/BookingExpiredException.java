package com.abhi.parkspace.booking.exception;

public class BookingExpiredException  extends RuntimeException {
    public BookingExpiredException(String message) {
        super(message);
    }
}
