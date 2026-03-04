package com.bubblebreath.parentregistration.service;

import com.bubblebreath.parentregistration.dto.RegistrationRequest;
import com.bubblebreath.parentregistration.dto.RegistrationResponse;
import com.bubblebreath.parentregistration.dto.UpdateUserRequest;
import com.bubblebreath.parentregistration.dto.UserResponse;
import com.bubblebreath.parentregistration.entity.EmailVerification;
import com.bubblebreath.parentregistration.entity.User;
import com.bubblebreath.parentregistration.exception.DuplicateEmailException;
import com.bubblebreath.parentregistration.exception.InvalidPasswordException;
import com.bubblebreath.parentregistration.repository.EmailVerificationRepository;
import com.bubblebreath.parentregistration.repository.PasswordResetTokenRepository;
import com.bubblebreath.parentregistration.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final EmailVerificationRepository emailVerificationRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Transactional
    public RegistrationResponse registerUser(RegistrationRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateEmailException("Email already registered: " + request.getEmail());
        }

        // Validate password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new InvalidPasswordException("Passwords do not match");
        }

        // Create user entity
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phoneNumber(request.getPhoneNumber())
                .country(request.getCountry())
                .termsAccepted(request.getTermsAccepted())
                .coppaConfirmed(request.getCoppaConfirmed())
                .newsletterSubscribed(request.getNewsletterSubscribed() != null ? request.getNewsletterSubscribed() : false)
                .emailVerified(false)
                .active(true)
                .failedLoginAttempts(0)
                .build();

        user = userRepository.save(user);

        // Generate and send verification code
        String verificationCode = generateVerificationCode();
        EmailVerification emailVerification = EmailVerification.builder()
                .user(user)
                .verificationCode(verificationCode)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .verified(false)
                .build();

        emailVerificationRepository.save(emailVerification);

        // Send verification email (do not fail registration if SMTP is not configured)
        String responseMessage;
        try {
            emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationCode);
            responseMessage = "Registration successful. Please check your email for verification code.";
            log.info("User registered successfully: {}", user.getEmail());
        } catch (MailException e) {
            log.warn("Verification email could not be sent (SMTP not configured or invalid credentials). User still registered. Code for {}: {}", user.getEmail(), verificationCode, e);
            responseMessage = "Registration successful. Verification email could not be sent. For development, use verification code: " + verificationCode + " (configure SMTP for production).";
        }

        return RegistrationResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .message(responseMessage)
                .emailVerificationRequired(true)
                .createdAt(user.getCreatedAt())
                .build();
    }

    @Transactional
    public void verifyEmail(String email, String verificationCode) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        EmailVerification verification = emailVerificationRepository
                .findByUserAndVerificationCodeAndVerifiedFalse(user, verificationCode)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification code"));

        if (verification.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification code has expired");
        }

        verification.setVerified(true);
        verification.setVerifiedAt(LocalDateTime.now());
        emailVerificationRepository.save(verification);

        user.setEmailVerified(true);
        userRepository.save(user);

        // Send welcome email (do not fail verification if SMTP fails)
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFullName());
        } catch (MailException e) {
            log.warn("Welcome email could not be sent for user: {}", email, e);
        }

        log.info("Email verified successfully for user: {}", email);
    }

    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return toUserResponse(user);
    }

    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::toUserResponse);
    }

    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getCountry() != null) user.setCountry(request.getCountry());
        if (request.getNewsletterSubscribed() != null) user.setNewsletterSubscribed(request.getNewsletterSubscribed());
        user = userRepository.save(user);
        log.info("User updated: {}", user.getEmail());
        return toUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        emailVerificationRepository.deleteByUser(user);
        passwordResetTokenRepository.deleteByUser(user);
        userRepository.delete(user);
        log.info("User deleted: id={}", id);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .country(user.getCountry())
                .emailVerified(user.getEmailVerified())
                .newsletterSubscribed(user.getNewsletterSubscribed())
                .active(user.getActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000);
        return String.valueOf(code);
    }
}
