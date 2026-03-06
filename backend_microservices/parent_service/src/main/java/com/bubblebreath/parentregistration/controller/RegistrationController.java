package com.bubblebreath.parentregistration.controller;

import com.bubblebreath.parentregistration.dto.ApiResponse;
import com.bubblebreath.parentregistration.dto.EmailVerificationRequest;
import com.bubblebreath.parentregistration.dto.ForgotPasswordRequest;
import com.bubblebreath.parentregistration.dto.RegistrationRequest;
import com.bubblebreath.parentregistration.dto.RegistrationResponse;
import com.bubblebreath.parentregistration.dto.ResetPasswordRequest;
import com.bubblebreath.parentregistration.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/registration")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class RegistrationController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<RegistrationResponse>> register(
            @Valid @RequestBody RegistrationRequest request) {
        try {
            RegistrationResponse response = userService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(response, "Registration successful"));
        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<ApiResponse<Void>> verifyEmail(
            @Valid @RequestBody EmailVerificationRequest request) {
        try {
            userService.verifyEmail(request.getEmail(), request.getVerificationCode());
            return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully"));
        } catch (Exception e) {
            log.error("Email verification failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<ApiResponse<String>> health() {
        return ResponseEntity.ok(ApiResponse.success("OK", "Service is healthy"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        try {
            userService.initiatePasswordReset(request);
            // Do not reveal whether the email exists
            return ResponseEntity.ok(ApiResponse.success(null,
                    "If an account exists for this email, a password reset link has been sent."));
        } catch (Exception e) {
            log.error("Forgot password request failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(request);
            return ResponseEntity.ok(ApiResponse.success(null, "Password has been reset successfully"));
        } catch (Exception e) {
            log.error("Password reset failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
}
