package com.bubble_breath.challenge_service.dto.request;

import com.bubble_breath.challenge_service.enums.TimeWindow;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ChallengeRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Game ID is required")
    private UUID gameId;

    @NotNull(message = "Target score is required")
    private Double targetScore;

    @NotNull(message = "Time window is required")
    private TimeWindow timeWindow;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isActive;
}
