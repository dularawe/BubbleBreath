package com.bubble_breath.game_service.dto.request;

import lombok.Data;

@Data
public class CategoryRequest {

    private String name;

    private String description;

    private Boolean isActive;
}

