package com.abhi.parkspace.parking.exception;

public class ParkingLotAlreadyExistsException  extends RuntimeException {
    public ParkingLotAlreadyExistsException(String message) {
        super(message);
    }
}
