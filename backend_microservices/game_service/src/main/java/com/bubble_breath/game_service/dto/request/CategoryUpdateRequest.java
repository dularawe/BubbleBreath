package com.bubble_breath.game_service.dto.request;

import lombok.Data;

import java.util.UUID;

@Data
public class CategoryUpdateRequest {

    private UUID id;

    private String name;

    private String description;

    private Boolean isActive;
}

