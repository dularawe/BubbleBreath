package com.bubble_breath.achievment_service.dto.request;

import com.bubble_breath.achievment_service.entity.ConditionType;
import lombok.Data;

import java.util.UUID;

@Data
public class AchivementUpdateRequest {

    private UUID id;

    private String name;

    private String description;

    private UUID gameId;

    private ConditionType conditionType;

    private Double conditionValue;

    private UUID userId;
}
