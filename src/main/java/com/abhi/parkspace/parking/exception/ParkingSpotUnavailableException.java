package com.abhi.parkspace.parking.exception;

public class ParkingSpotUnavailableException  extends RuntimeException {
    public ParkingSpotUnavailableException(String message) {
        super(message);
    }
}
