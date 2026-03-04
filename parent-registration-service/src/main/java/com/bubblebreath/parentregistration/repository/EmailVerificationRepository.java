package com.bubblebreath.parentregistration.repository;

import com.bubblebreath.parentregistration.entity.EmailVerification;
import com.bubblebreath.parentregistration.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByUserAndVerificationCodeAndVerifiedFalse(
            User user, String verificationCode);
    Optional<EmailVerification> findFirstByUserOrderByCreatedAtDesc(User user);
    void deleteByExpiresAtBefore(LocalDateTime now);
    void deleteByUser(User user);
}
