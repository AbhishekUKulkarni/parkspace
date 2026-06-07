package com.abhi.parkspace.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(

        @NotBlank(message = "Full name is required")
        @Size(
                min = 3,
                max = 50,
                message = "Full name must be between 3 and 50 characters"
        )
        String fullName,

        @Email(message = "Invalid email")
        @NotBlank(message = "Email is required")
        String email,

        @NotBlank(message = "Password is required")
        @Size(
                min = 6,
                message = "Password must be at least 6 characters"
        )
        String password
) {
}