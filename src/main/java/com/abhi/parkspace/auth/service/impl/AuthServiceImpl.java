package com.abhi.parkspace.auth.service.impl;

import com.abhi.parkspace.auth.dto.request.LoginRequest;
import com.abhi.parkspace.auth.dto.request.RegisterRequest;
import com.abhi.parkspace.auth.dto.response.AuthResponse;
import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.auth.enums.Role;
import com.abhi.parkspace.auth.exception.UserAlreadyExistsException;
import com.abhi.parkspace.auth.repository.UserRepository;
import com.abhi.parkspace.auth.service.AuthService;
import com.abhi.parkspace.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthServiceImpl
        implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final AuthenticationManager
            authenticationManager;

    @Override
    public AuthResponse register(
            RegisterRequest request
    ) {

        String normalizedEmail =
                request.email()
                        .trim()
                        .toLowerCase();

        validateUserDoesNotExist(
                normalizedEmail
        );

        User user = User.builder()
                .fullName(
                        request.fullName().trim()
                )
                .email(normalizedEmail)
                .password(
                        passwordEncoder.encode(
                                request.password()
                        )
                )
                .role(Role.USER)
                .build();

        userRepository.save(user);

        String token =
                jwtService.generateToken(user);

        log.info(
                "User registered successfully: {}",
                user.getEmail()
        );

        return buildAuthResponse(
                token,
                user
        );
    }

    @Override
    public AuthResponse login(
            LoginRequest request
    ) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.email()
                                        .trim()
                                        .toLowerCase(),
                                request.password()
                        )
                );

        User user =
                (User) authentication.getPrincipal();

        String token =
                jwtService.generateToken(user);

        log.info(
                "User logged in successfully: {}",
                user.getEmail()
        );

        return buildAuthResponse(
                token,
                user
        );
    }

    private void validateUserDoesNotExist(
            String email
    ) {

        if (userRepository.existsByEmail(email)) {

            throw new UserAlreadyExistsException(
                    "User already exists with this email"
            );
        }
    }

    private AuthResponse buildAuthResponse(
            String token,
            User user
    ) {

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole()
        );
    }
}