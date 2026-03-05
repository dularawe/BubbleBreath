package com.bubblebreath.loginservice.controller;

import com.bubblebreath.loginservice.dto.ForgotPasswordRequest;
import com.bubblebreath.loginservice.dto.LoginRequest;
import com.bubblebreath.loginservice.dto.LoginResponse;
import com.bubblebreath.loginservice.dto.ResetPasswordRequest;
import com.bubblebreath.loginservice.service.AuthService;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.authenticate(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            authService.processForgotPassword(request.getEmail());
            return ResponseEntity
                    .ok(Map.of("message", "If your email is registered, you will receive a password reset link."));
        } catch (Exception e) {
            // Even if it fails, return 200 to prevent email enumeration
            return ResponseEntity
                    .ok(Map.of("message", "If your email is registered, you will receive a password reset link."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.updatePassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Client side will drop the token. Add token blacklist here if needed.
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }
}
