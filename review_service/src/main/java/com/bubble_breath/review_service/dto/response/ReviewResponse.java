package com.bubble_breath.review_service.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class ReviewResponse {

    private UUID id;

    private UUID userId;

    private UUID gameId;

    private Integer rating;

    private String comment;

    private LocalDateTime createdDateTime;

    private LocalDateTime modifiedDateTime;
}
