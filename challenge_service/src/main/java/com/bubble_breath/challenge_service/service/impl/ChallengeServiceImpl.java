package com.bubble_breath.challenge_service.service.impl;

import com.bubble_breath.challenge_service.dto.request.ChallengeRequest;
import com.bubble_breath.challenge_service.dto.request.ChallengeUpdateRequest;
import com.bubble_breath.challenge_service.dto.response.ChallengeResponse;
import com.bubble_breath.challenge_service.entity.Challenge;
import com.bubble_breath.challenge_service.repository.ChallengeRepository;
import com.bubble_breath.challenge_service.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ChallengeServiceImpl implements ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    @Override
    @Transactional
    public ChallengeResponse save(ChallengeRequest request) {
        Challenge challenge = new Challenge();
        challenge.setTitle(request.getTitle());
        challenge.setDescription(request.getDescription());
        challenge.setGameId(request.getGameId());
        challenge.setTargetScore(request.getTargetScore());
        challenge.setTimeWindow(request.getTimeWindow());
        challenge.setStartDate(request.getStartDate());
        challenge.setEndDate(request.getEndDate());
        challenge.setIsActive(request.getIsActive() != null ? request.getIsActive() : true);
        Challenge save = challengeRepository.save(challenge);
        return convert(save);
    }

    @Override
    @Transactional
    public ChallengeResponse update(ChallengeUpdateRequest request) {
        Challenge challenge = challengeRepository.findById(request.getId()).orElse(null);
        if (challenge == null) {
            return null;
        }
        if (request.getTitle() != null) challenge.setTitle(request.getTitle());
        if (request.getDescription() != null) challenge.setDescription(request.getDescription());
        if (request.getGameId() != null) challenge.setGameId(request.getGameId());
        if (request.getTargetScore() != null) challenge.setTargetScore(request.getTargetScore());
        if (request.getTimeWindow() != null) challenge.setTimeWindow(request.getTimeWindow());
        if (request.getStartDate() != null) challenge.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) challenge.setEndDate(request.getEndDate());
        if (request.getIsActive() != null) challenge.setIsActive(request.getIsActive());
        Challenge updated = challengeRepository.save(challenge);
        return convert(updated);
    }

    @Override
    public ChallengeResponse getById(UUID id) {
        return challengeRepository.findById(id).map(ChallengeServiceImpl::convert).orElse(null);
    }

    @Override
    public List<ChallengeResponse> getAll() {
        return challengeRepository.findAll()
                .stream().map(ChallengeServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Integer delete(UUID id) {
        Challenge got = challengeRepository.findById(id).orElse(null);
        if (got == null) {
            return 0;
        }
        challengeRepository.delete(got);
        return 1;
    }

    private static ChallengeResponse convert(Challenge challenge) {
        ChallengeResponse response = new ChallengeResponse();
        response.setId(challenge.getId());
        response.setTitle(challenge.getTitle());
        response.setDescription(challenge.getDescription());
        response.setGameId(challenge.getGameId());
        response.setTargetScore(challenge.getTargetScore());
        response.setTimeWindow(challenge.getTimeWindow());
        response.setStartDate(challenge.getStartDate());
        response.setEndDate(challenge.getEndDate());
        response.setIsActive(challenge.getIsActive());
        return response;
    }
}