package com.abhi.parkspace.auth.security;

import com.abhi.parkspace.auth.repository.RevokedTokenRepository;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService customUserDetailsService;
    private final RevokedTokenRepository revokedTokenRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);

        try {
            if (revokedTokenRepository.existsByToken(jwtToken)) {
                log.warn("JWT rejected because it has been revoked: {}",
                        request.getRequestURI());

                writeUnauthorized(
                        response,
                        "Token has been revoked. Please log in again."
                );
                return;
            }

            String userEmail = jwtService.extractUsername(jwtToken);

            if (userEmail == null || userEmail.isBlank()) {
                log.warn("JWT has no valid subject: {}",
                        request.getRequestURI());

                writeUnauthorized(response, "Invalid authentication token.");
                return;
            }

            if (SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails;

                try {
                    userDetails =
                            customUserDetailsService.loadUserByUsername(userEmail);
                } catch (UsernameNotFoundException ex) {
                    log.warn("JWT references an unknown user: {}",
                            request.getRequestURI());

                    writeUnauthorized(response, "Invalid authentication token.");
                    return;
                }

                if (!jwtService.isTokenValid(jwtToken, userDetails)) {
                    log.warn("JWT is expired or failed validation: {}",
                            request.getRequestURI());

                    writeUnauthorized(
                            response,
                            "Invalid or expired authentication token."
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (JwtException | IllegalArgumentException ex) {
            log.warn(
                    "JWT parsing or signature validation failed for {}: {}",
                    request.getRequestURI(),
                    ex.getMessage()
            );

            SecurityContextHolder.clearContext();

            writeUnauthorized(
                    response,
                    "Invalid or expired authentication token."
            );
            return;

        } catch (Exception ex) {
            log.error(
                    "Unexpected JWT authentication failure for {}",
                    request.getRequestURI(),
                    ex
            );

            SecurityContextHolder.clearContext();

            writeUnauthorized(response, "Authentication failed.");
            return;
        }

        // Keep downstream controller and filter exceptions outside the JWT catch.
        filterChain.doFilter(request, response);
    }

    private void writeUnauthorized(
            HttpServletResponse response,
            String message
    ) throws IOException {

        if (response.isCommitted()) {
            return;
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Messages passed here are fixed strings, not user input.
        response.getWriter().write(
                "{\"status\":401,\"message\":\"" + message + "\"}"
        );
    }
}
