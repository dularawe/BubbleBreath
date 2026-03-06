package com.bubble_breath.challenge_service.service;

import com.bubble_breath.challenge_service.dto.request.ChallengeRequest;
import com.bubble_breath.challenge_service.dto.request.ChallengeUpdateRequest;
import com.bubble_breath.challenge_service.dto.response.ChallengeResponse;

import java.util.List;
import java.util.UUID;

public interface ChallengeService {

    ChallengeResponse save(ChallengeRequest request);

    ChallengeResponse update(ChallengeUpdateRequest request);

    ChallengeResponse getById(UUID id);

    List<ChallengeResponse> getAll();


    Integer delete(UUID id);
}