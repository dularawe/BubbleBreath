package com.bubble_breath.achievment_service.dto.response;


import com.bubble_breath.achievment_service.entity.ConditionType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class AchivementResponse {

    private UUID id;

    private String name;

    private String description;

    private UUID gameId;

    private ConditionType conditionType;

    private Double conditionValue;

    private UUID userId;

    private LocalDateTime unlockedAt;
}
