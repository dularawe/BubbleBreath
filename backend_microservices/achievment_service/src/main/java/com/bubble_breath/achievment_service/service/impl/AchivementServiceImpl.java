package com.bubble_breath.achievment_service.service.impl;

import com.bubble_breath.achievment_service.dto.request.AchivementRequest;
import com.bubble_breath.achievment_service.dto.request.AchivementUpdateRequest;
import com.bubble_breath.achievment_service.dto.response.AchivementResponse;
import com.bubble_breath.achievment_service.entity.Achivement;
import com.bubble_breath.achievment_service.repository.AchivementRepository;
import com.bubble_breath.achievment_service.service.AchivementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AchivementServiceImpl implements AchivementService {

    @Autowired
    private AchivementRepository achivementRepository;

    @Override
    @Transactional
    public AchivementResponse save(AchivementRequest request) {
        Achivement achivement = new Achivement();
        achivement.setName(request.getName());
        achivement.setDescription(request.getDescription());
        achivement.setGameId(request.getGameId());
        achivement.setConditionType(request.getConditionType());
        achivement.setConditionValue(request.getConditionValue());
        achivement.setUserId(request.getUserId());
        achivement.setUnlockedAt(LocalDateTime.now());
        Achivement save = achivementRepository.save(achivement);
        return convert(save);
    }

    @Override
    @Transactional
    public AchivementResponse update(AchivementUpdateRequest request) {
        Achivement achivement = achivementRepository.findById(request.getId()).orElse(null);
        if (achivement == null) {
            return null;
        }
        achivement.setName(request.getName());
        achivement.setDescription(request.getDescription());
        achivement.setGameId(request.getGameId());
        achivement.setConditionType(request.getConditionType());
        achivement.setConditionValue(request.getConditionValue());
        achivement.setUserId(request.getUserId());
        Achivement updated = achivementRepository.save(achivement);
        return convert(updated);
    }

    @Override
    public AchivementResponse getById(UUID id) {
        return achivementRepository.findById(id).map(AchivementServiceImpl::convert).orElse(null);
    }

    @Override
    public List<AchivementResponse> getAll() {
        return achivementRepository.findAll()
                .stream().map(AchivementServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Integer delete(UUID id) {
        Achivement got = achivementRepository.findById(id).orElse(null);
        if (got == null) {
            return 0;
        }
        achivementRepository.delete(got);
        return 1;
    }

    private static AchivementResponse convert(Achivement achivement) {
        AchivementResponse response = new AchivementResponse();
        response.setId(achivement.getId());
        response.setName(achivement.getName());
        response.setDescription(achivement.getDescription());
        response.setGameId(achivement.getGameId());
        response.setConditionType(achivement.getConditionType());
        response.setConditionValue(achivement.getConditionValue());
        response.setUserId(achivement.getUserId());
        response.setUnlockedAt(achivement.getUnlockedAt());
        return response;
    }
}