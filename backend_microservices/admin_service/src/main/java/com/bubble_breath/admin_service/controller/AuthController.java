package com.bubble_breath.admin_service.controller;

import com.bubble_breath.admin_service.dto.request.ChangePasswordRequest;
import com.bubble_breath.admin_service.dto.request.ForgotPasswordRequest;
import com.bubble_breath.admin_service.dto.request.LoginRequest;
import com.bubble_breath.admin_service.dto.request.RefreshTokenRequest;
import com.bubble_breath.admin_service.dto.response.AuthResponse;
import com.bubble_breath.admin_service.dto.response.MessageResponse;
import com.bubble_breath.admin_service.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication management APIs")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }


    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> logout(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.logout(request));
    }

    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/logout-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> logoutAll(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.logoutAll(userDetails.getUsername()));
    }

    @Operation( security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(authService.changePassword(request, userDetails.getUsername()));
    }
}
