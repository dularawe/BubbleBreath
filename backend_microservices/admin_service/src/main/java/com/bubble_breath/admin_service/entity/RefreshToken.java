package com.bubble_breath.admin_service.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "token", nullable = false, unique = true, length = 512)
    private String token;
    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;
    @Builder.Default
    @Column(name = "revoked", nullable = false)
    private boolean revoked = false;
}

