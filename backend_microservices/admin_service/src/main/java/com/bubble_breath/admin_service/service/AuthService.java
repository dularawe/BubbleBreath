package com.bubble_breath.admin_service.service;

import com.bubble_breath.admin_service.configuration.JwtService;
import com.bubble_breath.admin_service.configuration.UserDetailsImpl;
import com.bubble_breath.admin_service.dto.request.ChangePasswordRequest;
import com.bubble_breath.admin_service.dto.request.ForgotPasswordRequest;
import com.bubble_breath.admin_service.dto.request.LoginRequest;
import com.bubble_breath.admin_service.dto.request.RefreshTokenRequest;
import com.bubble_breath.admin_service.dto.response.AuthResponse;
import com.bubble_breath.admin_service.dto.response.MessageResponse;
import com.bubble_breath.admin_service.entity.RefreshToken;
import com.bubble_breath.admin_service.entity.User;
import com.bubble_breath.admin_service.repository.RefreshTokenRepository;
import com.bubble_breath.admin_service.repository.UsersRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsersRepository usersRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    @Value("${application.security.jwt.refresh-token.expiration}")
    private long refreshTokenExpiration;

    // ─────────────────────────────────────────
    //  LOGIN
    // ─────────────────────────────────────────
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Revoke existing refresh tokens for single-session enforcement
        refreshTokenRepository.revokeAllUserTokens(user);

        String accessToken = jwtService.generateToken(userDetails);
        RefreshToken refreshToken = createRefreshToken(user);

        log.info("User logged in: {}", user.getEmail());

        return buildAuthResponse(accessToken, refreshToken.getToken(), user);
    }

    // ─────────────────────────────────────────
    //  REFRESH TOKEN
    // ─────────────────────────────────────────
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new IllegalArgumentException("Refresh token not found"));

        if (storedToken.isRevoked()) {
            refreshTokenRepository.revokeAllUserTokens(storedToken.getUser());
            throw new IllegalArgumentException("Refresh token has been revoked. Please log in again.");
        }

        if (storedToken.getExpiryDate().isBefore(Instant.now())) {
            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);
            throw new IllegalArgumentException("Refresh token has expired. Please log in again.");
        }

        User user = storedToken.getUser();
        UserDetailsImpl userDetails = new UserDetailsImpl(user);

        // Rotate: revoke old, issue new refresh token
        storedToken.setRevoked(true);
        refreshTokenRepository.save(storedToken);

        String newAccessToken = jwtService.generateToken(userDetails);
        RefreshToken newRefreshToken = createRefreshToken(user);

        log.info("Token refreshed for user: {}", user.getEmail());

        return buildAuthResponse(newAccessToken, newRefreshToken.getToken(), user);
    }

    // ─────────────────────────────────────────
    //  LOGOUT
    // ─────────────────────────────────────────
    @Transactional
    public MessageResponse logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                    log.info("User logged out: {}", token.getUser().getEmail());
                });

        SecurityContextHolder.clearContext();

        return MessageResponse.builder()
                .success(true)
                .message("Logged out successfully")
                .build();
    }

    // ─────────────────────────────────────────
    //  LOGOUT ALL (all devices)
    // ─────────────────────────────────────────
    @Transactional
    public MessageResponse logoutAll(String email) {
        User user = usersRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        refreshTokenRepository.revokeAllUserTokens(user);
        SecurityContextHolder.clearContext();
        log.info("All sessions revoked for user: {}", email);

        return MessageResponse.builder()
                .success(true)
                .message("Logged out from all devices successfully")
                .build();
    }

    // ─────────────────────────────────────────
    //  FORGOT PASSWORD (direct reset, no token)
    // ─────────────────────────────────────────
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = usersRepository.findByEmailWithRoles(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("No account found with that email"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usersRepository.save(user);

        refreshTokenRepository.revokeAllUserTokens(user);

        log.info("Password reset for user: {}", user.getEmail());

        return MessageResponse.builder()
                .success(true)
                .message("Password has been reset successfully. Please log in again.")
                .build();
    }

    // ─────────────────────────────────────────
    //  CHANGE PASSWORD (authenticated user)
    // ─────────────────────────────────────────
    @Transactional
    public MessageResponse changePassword(ChangePasswordRequest request, String email) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Passwords do not match");
        }

        User user = usersRepository.findByEmailWithRoles(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        usersRepository.save(user);

        refreshTokenRepository.revokeAllUserTokens(user);

        log.info("Password changed for user: {}", email);

        return MessageResponse.builder()
                .success(true)
                .message("Password changed successfully. Please log in again.")
                .build();
    }

    // ─────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────
    private RefreshToken createRefreshToken(User user) {
        RefreshToken token = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpiration))
                .revoked(false)
                .build();
        return refreshTokenRepository.save(token);
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user) {
        Set<String> roles = user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .roles(roles)
                .build();
    }
}
