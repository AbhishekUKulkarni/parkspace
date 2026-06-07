package com.abhi.parkspace.auth.service;

import com.abhi.parkspace.auth.dto.request.LoginRequest;
import com.abhi.parkspace.auth.dto.request.RegisterRequest;
import com.abhi.parkspace.auth.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}