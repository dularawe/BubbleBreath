package com.bubble_breath.challenge_service.entity;

import com.bubble_breath.challenge_service.enums.TimeWindow;
import lombok.Data;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "CHALLENGE")
@Data
public class Challenge {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(name = "GAME_ID", nullable = false, columnDefinition = "BINARY(16)")
    private UUID gameId;

    @Column(name = "TARGET_SCORE", nullable = false)
    private Double targetScore;

    @Enumerated(EnumType.STRING)
    @Column(name = "TIME_WINDOW", nullable = false)
    private TimeWindow timeWindow;

    @Column(name = "START_DATE")
    private LocalDate startDate;

    @Column(name = "END_DATE")
    private LocalDate endDate;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;
}