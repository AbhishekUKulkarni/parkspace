package com.abhi.parkspace.auth.dto.response;

import com.abhi.parkspace.auth.enums.Role;

public record AuthResponse(

        String token,
        String email,
        Role role
) {
}