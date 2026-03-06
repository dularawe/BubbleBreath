package com.bubble_breath.game_service.service;

import com.bubble_breath.game_service.dto.request.GameRequest;
import com.bubble_breath.game_service.dto.request.GameUpdateRequest;
import com.bubble_breath.game_service.dto.response.GameResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface GameService {

    GameResponse save(GameRequest request);

    GameResponse update(GameUpdateRequest request);

    GameResponse getById(UUID id);

    List<GameResponse> getAll();


    Integer delete(UUID id);
}