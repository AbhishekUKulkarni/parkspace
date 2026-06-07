package com.abhi.parkspace.parking.exception;

public class ParkingAccessDeniedException  extends RuntimeException {

    public ParkingAccessDeniedException(String message) {
        super(message);
    }
}
