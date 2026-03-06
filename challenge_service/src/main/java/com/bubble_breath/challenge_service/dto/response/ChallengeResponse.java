package com.bubble_breath.challenge_service.dto.response;

import com.bubble_breath.challenge_service.enums.TimeWindow;
import lombok.Data;

import java.time.LocalDate;
import java.util.UUID;

@Data
public class ChallengeResponse {

    private UUID id;

    private String title;

    private String description;

    private UUID gameId;

    private Double targetScore;

    private TimeWindow timeWindow;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isActive;
}
