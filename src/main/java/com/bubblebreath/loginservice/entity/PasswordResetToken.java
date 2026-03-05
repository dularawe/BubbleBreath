package com.bubblebreath.loginservice.entity;

import javax.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens", indexes = {
        @Index(name = "idx_token", columnList = "token", unique = true)
})
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public PasswordResetToken() {
    }

    public PasswordResetToken(Long id, String token, User user, LocalDateTime expiryDate, LocalDateTime createdAt) {
        this.id = id;
        this.token = token;
        this.user = user;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
    }

    public static PasswordResetTokenBuilder builder() {
        return new PasswordResetTokenBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static class PasswordResetTokenBuilder {
        private Long id;
        private String token;
        private User user;
        private LocalDateTime expiryDate;

        PasswordResetTokenBuilder() {
        }

        public PasswordResetTokenBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public PasswordResetTokenBuilder token(String token) {
            this.token = token;
            return this;
        }

        public PasswordResetTokenBuilder user(User user) {
            this.user = user;
            return this;
        }

        public PasswordResetTokenBuilder expiryDate(LocalDateTime expiryDate) {
            this.expiryDate = expiryDate;
            return this;
        }

        public PasswordResetToken build() {
            PasswordResetToken t = new PasswordResetToken();
            t.id = this.id;
            t.token = this.token;
            t.user = this.user;
            t.expiryDate = this.expiryDate;
            return t;
        }
    }
}
