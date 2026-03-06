package com.bubble_breath.game_service.dto.request;


import lombok.Data;
import java.util.UUID;

@Data
public class GameRequest {

private String title;

private String description;

private UUID categoryId;

private String thumbnailUrl;

private Boolean isActive;

 }