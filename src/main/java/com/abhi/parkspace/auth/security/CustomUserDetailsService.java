package com.abhi.parkspace.auth.security;

import com.abhi.parkspace.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        log.info("Looking up user for JWT subject: {}", username);

        return userRepository.findByEmail(username)
                .orElseThrow(() -> {
                    log.warn("No user found for JWT subject: {}", username);
                    return new UsernameNotFoundException("User not found");
                });
    }
}

