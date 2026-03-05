package com.bubblebreath.loginservice.entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_email", columnList = "email", unique = true)
})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String fullName;

    @Email
    @NotBlank
    @Size(max = 255)
    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank
    @Size(min = 8)
    @Column(nullable = false)
    private String password;

    @Size(max = 20)
    @Column(length = 20)
    private String phoneNumber;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String country;

    @Column(nullable = false)
    private Boolean emailVerified = false;

    @Column(nullable = false)
    private Boolean termsAccepted = false;

    @Column(nullable = false)
    private Boolean coppaConfirmed = false;

    @Column(nullable = false)
    private Boolean newsletterSubscribed = false;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(nullable = false)
    private Integer failedLoginAttempts = 0;

    private LocalDateTime accountLockedUntil;

    private LocalDateTime lastLoginAt;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    public User() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Boolean getEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(Boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public Boolean getTermsAccepted() {
        return termsAccepted;
    }

    public void setTermsAccepted(Boolean termsAccepted) {
        this.termsAccepted = termsAccepted;
    }

    public Boolean getCoppaConfirmed() {
        return coppaConfirmed;
    }

    public void setCoppaConfirmed(Boolean coppaConfirmed) {
        this.coppaConfirmed = coppaConfirmed;
    }

    public Boolean getNewsletterSubscribed() {
        return newsletterSubscribed;
    }

    public void setNewsletterSubscribed(Boolean newsletterSubscribed) {
        this.newsletterSubscribed = newsletterSubscribed;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getFailedLoginAttempts() {
        return failedLoginAttempts;
    }

    public void setFailedLoginAttempts(Integer failedLoginAttempts) {
        this.failedLoginAttempts = failedLoginAttempts;
    }

    public LocalDateTime getAccountLockedUntil() {
        return accountLockedUntil;
    }

    public void setAccountLockedUntil(LocalDateTime accountLockedUntil) {
        this.accountLockedUntil = accountLockedUntil;
    }

    public LocalDateTime getLastLoginAt() {
        return lastLoginAt;
    }

    public void setLastLoginAt(LocalDateTime lastLoginAt) {
        this.lastLoginAt = lastLoginAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    public static class UserBuilder {
        private String fullName;
        private String email;
        private String password;
        private String phoneNumber;
        private String country;
        private Boolean emailVerified = false;
        private Boolean termsAccepted = false;
        private Boolean coppaConfirmed = false;
        private Boolean newsletterSubscribed = false;
        private Boolean active = true;
        private Integer failedLoginAttempts = 0;
        private LocalDateTime accountLockedUntil;
        private LocalDateTime lastLoginAt;

        UserBuilder() {
        }

        public UserBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public UserBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserBuilder password(String password) {
            this.password = password;
            return this;
        }

        public UserBuilder phoneNumber(String phoneNumber) {
            this.phoneNumber = phoneNumber;
            return this;
        }

        public UserBuilder country(String country) {
            this.country = country;
            return this;
        }

        public UserBuilder emailVerified(Boolean emailVerified) {
            this.emailVerified = emailVerified;
            return this;
        }

        public UserBuilder termsAccepted(Boolean termsAccepted) {
            this.termsAccepted = termsAccepted;
            return this;
        }

        public UserBuilder coppaConfirmed(Boolean coppaConfirmed) {
            this.coppaConfirmed = coppaConfirmed;
            return this;
        }

        public UserBuilder newsletterSubscribed(Boolean newsletterSubscribed) {
            this.newsletterSubscribed = newsletterSubscribed;
            return this;
        }

        public UserBuilder active(Boolean active) {
            this.active = active;
            return this;
        }

        public UserBuilder failedLoginAttempts(Integer failedLoginAttempts) {
            this.failedLoginAttempts = failedLoginAttempts;
            return this;
        }

        public UserBuilder accountLockedUntil(LocalDateTime accountLockedUntil) {
            this.accountLockedUntil = accountLockedUntil;
            return this;
        }

        public UserBuilder lastLoginAt(LocalDateTime lastLoginAt) {
            this.lastLoginAt = lastLoginAt;
            return this;
        }

        public User build() {
            User u = new User();
            u.fullName = this.fullName;
            u.email = this.email;
            u.password = this.password;
            u.phoneNumber = this.phoneNumber;
            u.country = this.country;
            u.emailVerified = this.emailVerified;
            u.termsAccepted = this.termsAccepted;
            u.coppaConfirmed = this.coppaConfirmed;
            u.newsletterSubscribed = this.newsletterSubscribed;
            u.active = this.active;
            u.failedLoginAttempts = this.failedLoginAttempts;
            u.accountLockedUntil = this.accountLockedUntil;
            u.lastLoginAt = this.lastLoginAt;
            return u;
        }
    }
}
