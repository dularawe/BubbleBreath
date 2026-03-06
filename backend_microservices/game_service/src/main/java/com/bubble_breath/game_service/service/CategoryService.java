package com.bubble_breath.game_service.service;

import com.bubble_breath.game_service.dto.request.CategoryRequest;
import com.bubble_breath.game_service.dto.request.CategoryUpdateRequest;
import com.bubble_breath.game_service.dto.response.CategoryResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public interface CategoryService {

    CategoryResponse save(CategoryRequest request);

    CategoryResponse update(CategoryUpdateRequest request);

    CategoryResponse getById(UUID id);

    List<CategoryResponse> getAll();

    Integer delete(UUID id);
}

