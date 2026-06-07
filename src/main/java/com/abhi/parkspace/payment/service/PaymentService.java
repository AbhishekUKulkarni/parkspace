package com.abhi.parkspace.payment.service;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.payment.dto.request.CreatePaymentRequest;
import com.abhi.parkspace.payment.dto.response.PaymentResponse;

import java.util.List;
import java.util.UUID;

public interface PaymentService {

    PaymentResponse createPayment(
            CreatePaymentRequest request,
            User user
    );

    List<PaymentResponse> getUserPayments(
            User user
    );

    PaymentResponse getPaymentById(
            UUID paymentId,
            User user
    );

    PaymentResponse refundPayment(
            UUID paymentId
    );
}