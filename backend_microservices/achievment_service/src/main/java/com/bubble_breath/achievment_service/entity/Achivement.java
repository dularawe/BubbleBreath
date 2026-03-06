package com.bubble_breath.achievment_service.entity;

import lombok.Data;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ACHIVEMENT")
@Data
public class Achivement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "GAME_ID")
    private UUID gameId;

    @Enumerated(EnumType.STRING)
    @Column(name = "CONDITION_TYPE", nullable = false)
    private ConditionType conditionType;

    @Column(name = "CONDITION_VALUE", nullable = false)
    private Double conditionValue;

    @Column(name = "USER_ID", nullable = false)
    private UUID userId;

    @Column(name = "UNLOCKED_AT")
    private LocalDateTime unlockedAt;
}