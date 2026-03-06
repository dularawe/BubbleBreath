package com.bubble_breath.game_service.dto.response;

import com.bubble_breath.game_service.enums.Deleted;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryResponse {

    private UUID id;

    private String name;

    private String description;

    private Boolean isActive;

    private String createdBy;

    private String createdDateTime;

    private String modifiedBy;

    private String modifiedDateTime;

    private Deleted isDeleted;
}
