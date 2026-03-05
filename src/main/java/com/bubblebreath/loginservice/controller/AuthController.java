package com.bubblebreath.loginservice.controller;

import com.bubblebreath.loginservice.dto.ForgotPasswordRequest;
import com.bubblebreath.loginservice.dto.LoginRequest;
import com.bubblebreath.loginservice.dto.LoginResponse;
import com.bubblebreath.loginservice.dto.ResetPasswordRequest;
import com.bubblebreath.loginservice.service.AuthService;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Authenticates a user and sets an HTTP-only cookie containing the JWT token.
     * If 'rememberMe' is true, the cookie format will last 7 days; else 24 hours.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        LoginResponse loginResponse = authService.authenticate(loginRequest);

        Cookie cookie = new Cookie("accessToken", loginResponse.getToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // Should be true in production with HTTPS
        cookie.setPath("/");
        cookie.setMaxAge(loginRequest.isRememberMe() ? 7 * 24 * 60 * 60 : 24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(loginResponse);
    }

    /**
     * Initiates the password reset flow.
     * Generates a 1-hour secure token and emails it to the user.
     * Always returns success to prevent email enumeration attacks.
     */
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

    /**
     * Consumes the secure token to reset the password.
     * Fails if the token is invalid, used, or expired (past 1 hour).
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            authService.updatePassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok(Map.of("message", "Password has been successfully reset"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Logs the user out. The client handles dropping the HTTP-Only cookie.
     * An advanced implementation might blacklist the token in the database.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        // Client side will drop the token. Add token blacklist here if needed.
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }
}
