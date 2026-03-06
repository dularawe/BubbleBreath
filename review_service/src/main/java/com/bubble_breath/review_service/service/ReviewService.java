package com.bubble_breath.review_service.service;

import com.bubble_breath.review_service.dto.request.ReviewRequest;
import com.bubble_breath.review_service.dto.request.ReviewUpdateRequest;
import com.bubble_breath.review_service.dto.response.ReviewResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    ReviewResponse save(ReviewRequest request);

    ReviewResponse update(ReviewUpdateRequest request);

    ReviewResponse getById(UUID id);

    List<ReviewResponse> getAll();

    List<ReviewResponse> getByGameId(UUID gameId);

    List<ReviewResponse> getByUserId(UUID userId);

    Integer delete(UUID id);
}