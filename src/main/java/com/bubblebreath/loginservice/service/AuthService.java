package com.bubblebreath.loginservice.service;

import com.bubblebreath.loginservice.dto.LoginRequest;
import com.bubblebreath.loginservice.dto.LoginResponse;
import com.bubblebreath.loginservice.entity.PasswordResetToken;
import com.bubblebreath.loginservice.entity.User;
import com.bubblebreath.loginservice.repository.PasswordResetTokenRepository;
import com.bubblebreath.loginservice.repository.UserRepository;
import com.bubblebreath.loginservice.security.JwtTokenProvider;
import com.bubblebreath.loginservice.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtTokenProvider tokenProvider;
    private final PasswordResetTokenRepository tokenRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCK_TIME_DURATION = 30; // in minutes

    public LoginResponse authenticate(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        // Check verification and lock statuses before authentication
        if (user.getAccountLockedUntil() != null && user.getAccountLockedUntil().isAfter(LocalDateTime.now())) {
            throw new LockedException(
                    "Your account has been locked due to multiple failed login attempts. Please try again later.");
        }

        if (!user.getEmailVerified()) {
            throw new BadCredentialsException("Please verify your email address before logging in.");
        }

        if (!user.getActive()) {
            throw new BadCredentialsException("Your account is deactivated. Please contact support.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Authentication successful, reset failed attempts
            if (user.getFailedLoginAttempts() > 0 || user.getAccountLockedUntil() != null) {
                user.setFailedLoginAttempts(0);
                user.setAccountLockedUntil(null);
            }

            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            String jwt = tokenProvider.generateToken(authentication);

            return LoginResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .country(user.getCountry())
                    .build();

        } catch (BadCredentialsException ex) {
            // Authentication failed, handle brute-force logic
            increaseFailedAttempts(user);
            throw ex;
        }
    }

    private void increaseFailedAttempts(User user) {
        int newFailAttempts = user.getFailedLoginAttempts() + 1;

        if (newFailAttempts >= MAX_FAILED_ATTEMPTS) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(LOCK_TIME_DURATION));
        }

        user.setFailedLoginAttempts(newFailAttempts);
        userRepository.save(user);
    }

    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        String token = UUID.randomUUID().toString();

        // delete existing tokens
        tokenRepository.deleteByUser(user);

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        tokenRepository.save(resetToken);

        // Send Email
        String text = "To reset your password, please use the following token:\n" + token;
        emailService.sendEmail(user.getEmail(), "Password Reset Request", text);
    }

    public void updatePassword(String token, String newPassword) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setAccountLockedUntil(null);
        user.setFailedLoginAttempts(0);
        userRepository.save(user);

        tokenRepository.deleteByUser(user);
    }
}
