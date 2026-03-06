package com.bubblebreath.parentregistration.repository;

import com.bubblebreath.parentregistration.entity.PasswordResetToken;
import com.bubblebreath.parentregistration.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenAndUsedFalse(String token);
    void deleteByExpiresAtBefore(LocalDateTime now);
    void deleteByUser(User user);
}
