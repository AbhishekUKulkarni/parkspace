package com.abhi.parkspace.booking.exception;

public class BookingAlreadyCancelledException  extends RuntimeException {
    public BookingAlreadyCancelledException(String message) {
        super(message);
    }
}
