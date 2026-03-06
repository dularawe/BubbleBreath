package com.bubble_breath.achievment_service.service;

import com.bubble_breath.achievment_service.dto.request.AchivementRequest;
import com.bubble_breath.achievment_service.dto.request.AchivementUpdateRequest;
import com.bubble_breath.achievment_service.dto.response.AchivementResponse;

import java.util.List;
import java.util.UUID;

public interface AchivementService {

    AchivementResponse save(AchivementRequest request);

    AchivementResponse update(AchivementUpdateRequest request);

    AchivementResponse getById(UUID id);

    List<AchivementResponse> getAll();


    Integer delete(UUID id);
}