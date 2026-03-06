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
public class UserResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String country;
    private Boolean emailVerified;
    private Boolean newsletterSubscribed;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
