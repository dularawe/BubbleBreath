package com.bubble_breath.game_service.service.impl;

import com.bubble_breath.game_service.dto.request.GameRequest;
import com.bubble_breath.game_service.dto.request.GameUpdateRequest;
import com.bubble_breath.game_service.dto.response.GameResponse;
import com.bubble_breath.game_service.entity.Category;
import com.bubble_breath.game_service.entity.Game;
import com.bubble_breath.game_service.enums.Deleted;
import com.bubble_breath.game_service.repository.CategoryRepository;
import com.bubble_breath.game_service.repository.GameRepository;
import com.bubble_breath.game_service.service.GameService;
import com.bubble_breath.game_service.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public GameResponse save(GameRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        if (category == null) {
            return null;
        }
        Game game = new Game();
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setCategory(category);
        game.setThumbnailUrl(request.getThumbnailUrl());
        game.setIsActive(request.getIsActive());
        game.setIsDeleted(Deleted.NO);
        Game saved = gameRepository.save(game);
        return convert(saved);
    }

    @Override
    @Transactional
    public GameResponse update(GameUpdateRequest request) {
        Game game = gameRepository.findById(request.getId()).orElse(null);
        if (game == null) {
            return null;
        }
        Category category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        if (category == null) {
            return null;
        }
        game.setTitle(request.getTitle());
        game.setDescription(request.getDescription());
        game.setCategory(category);
        game.setThumbnailUrl(request.getThumbnailUrl());
        game.setIsActive(request.getIsActive());
        Game updated = gameRepository.save(game);
        return convert(updated);
    }

    @Override
    public GameResponse getById(UUID id) {
        return gameRepository.findById(id).map(GameServiceImpl::convert).orElse(null);
    }

    @Override
    public List<GameResponse> getAll() {
        return gameRepository.findByIsDeleted(Deleted.NO)
                .stream().map(GameServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Integer delete(UUID id) {
        Game game = gameRepository.findById(id).orElse(null);
        if (game == null) {
            return 0;
        }
        game.setIsDeleted(Deleted.YES);
        gameRepository.save(game);
        return 1;
    }

    private static GameResponse convert(Game game) {
        GameResponse response = new GameResponse();
        response.setId(game.getId());
        response.setTitle(game.getTitle());
        response.setDescription(game.getDescription());
        if (game.getCategory() != null) {
            response.setCategoryId(game.getCategory().getId());
            response.setCategoryName(game.getCategory().getName());
        }
        response.setThumbnailUrl(game.getThumbnailUrl());
        response.setIsActive(game.getIsActive());
        response.setCreatedBy(game.getCreatedBy());
        response.setCreatedDateTime(ConvertUtils.convertDateToStr(game.getCreatedDateTime()));
        response.setModifiedBy(game.getModifiedBy());
        response.setModifiedDateTime(ConvertUtils.convertDateToStr(game.getModifiedDateTime()));
        response.setIsDeleted(game.getIsDeleted());
        return response;
    }
}