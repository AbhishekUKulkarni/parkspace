package com.abhi.parkspace.booking.exception;

public class BookingAlreadyExists extends RuntimeException{
    public BookingAlreadyExists(String message) {
        super(message);
    }
}

