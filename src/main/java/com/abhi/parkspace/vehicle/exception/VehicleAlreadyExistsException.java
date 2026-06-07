package com.abhi.parkspace.vehicle.exception;

public class VehicleAlreadyExistsException  extends RuntimeException {
    public VehicleAlreadyExistsException(String message) {
        super(message);
    }
}
