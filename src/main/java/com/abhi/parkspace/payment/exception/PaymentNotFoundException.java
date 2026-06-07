package com.abhi.parkspace.payment.exception;

public class PaymentNotFoundException  extends RuntimeException {
    public PaymentNotFoundException(String message) {
        super(message);
    }
}
