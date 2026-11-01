package com.abhi.parkspace.auth.service;

import com.abhi.parkspace.auth.dto.LoginRequest;
import com.abhi.parkspace.auth.dto.RegisterRequest;
import com.abhi.parkspace.auth.dto.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    void logout(String token);
}