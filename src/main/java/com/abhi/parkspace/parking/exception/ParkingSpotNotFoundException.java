package com.abhi.parkspace.parking.exception;

public class ParkingSpotNotFoundException  extends RuntimeException {
    public ParkingSpotNotFoundException(String message) {
        super(message);
    }
}
