package com.abhi.parkspace.auth.repository;

import com.abhi.parkspace.auth.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;

public interface RevokedTokenRepository
        extends JpaRepository<RevokedToken, Long> {

    boolean existsByToken(String token);

    void deleteByExpiresAtBefore(Instant time);
}