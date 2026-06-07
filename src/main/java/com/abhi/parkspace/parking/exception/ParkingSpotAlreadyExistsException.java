package com.abhi.parkspace.parking.exception;

public class ParkingSpotAlreadyExistsException  extends RuntimeException {
    public ParkingSpotAlreadyExistsException(String message) {
        super(message);
    }
}
