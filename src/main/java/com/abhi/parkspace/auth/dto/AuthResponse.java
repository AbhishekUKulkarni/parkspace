package com.abhi.parkspace.auth.dto;

public record AuthResponse(
        String token,
        String email
) {
}