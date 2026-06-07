package com.abhi.parkspace.payment.controller;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.payment.dto.request.CreatePaymentRequest;
import com.abhi.parkspace.payment.dto.response.PaymentResponse;
import com.abhi.parkspace.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('USER', 'ADMIN')")
public class PaymentController {

    private final PaymentService paymentService;

    /*
     =========================================
              CREATE PAYMENT
     =========================================
     */

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody
            CreatePaymentRequest request,

            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        paymentService.createPayment(
                                request,
                                user
                        )
                );
    }

    /*
     =========================================
              GET USER PAYMENTS
     =========================================
     */

    @GetMapping
    public ResponseEntity<List<PaymentResponse>>
    getUserPayments(
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                paymentService.getUserPayments(user)
        );
    }

    /*
     =========================================
              GET PAYMENT BY ID
     =========================================
     */

    @GetMapping("/{paymentId}")
    public ResponseEntity<PaymentResponse>
    getPaymentById(
            @PathVariable UUID paymentId,
            Authentication authentication
    ) {

        User user =
                (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                paymentService.getPaymentById(
                        paymentId,
                        user
                )
        );
    }

    /*
     =========================================
              REFUND PAYMENT
     =========================================
     */

    @PutMapping("/{paymentId}/refund")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse>
    refundPayment(
            @PathVariable UUID paymentId
    ) {

        return ResponseEntity.ok(
                paymentService.refundPayment(
                        paymentId
                )
        );
    }
}