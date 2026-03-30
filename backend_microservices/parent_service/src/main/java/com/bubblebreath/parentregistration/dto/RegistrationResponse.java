package com.bubblebreath.parentregistration.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegistrationResponse {
    private Long userId;
    private String email;
    private String message;
    private Boolean emailVerificationRequired;
    private LocalDateTime createdAt;
}
