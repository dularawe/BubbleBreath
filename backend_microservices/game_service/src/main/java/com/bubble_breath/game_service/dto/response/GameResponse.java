package com.bubble_breath.game_service.dto.response;

import com.bubble_breath.game_service.enums.Deleted;
import lombok.Data;

import java.util.UUID;

@Data
public class GameResponse {

    private UUID id;

    private String title;

    private String description;

    private UUID categoryId;

    private String categoryName;

    private String thumbnailUrl;

    private Boolean isActive;

    private String createdBy;

    private String createdDateTime;

    private String modifiedBy;

    private String modifiedDateTime;

    private Deleted isDeleted;
}
