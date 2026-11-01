package com.abhi.parkspace.booking.exception;

public class FailedToEndBooking extends RuntimeException{
    public FailedToEndBooking(String message) {
        super(message);
    }
}