package com.abhi.parkspace.auth.config;

import com.abhi.parkspace.auth.entity.User;
import com.abhi.parkspace.auth.enums.Role;
import com.abhi.parkspace.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AdminSeeder
        implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        String adminEmail =
                "admin@parkspace.com";

        if (
                userRepository.existsByEmail(
                        adminEmail
                )
        ) {
            return;
        }

        User admin = User.builder()
                .fullName("System Admin")
                .email(adminEmail)
                .password(
                        passwordEncoder.encode(
                                "Admin@123"
                        )
                )
                .role(Role.ADMIN)
                .build();

        userRepository.save(admin);

        log.info(
                "Admin user created successfully"
        );
    }
}