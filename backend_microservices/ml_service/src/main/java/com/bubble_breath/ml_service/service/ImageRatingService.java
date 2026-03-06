package com.bubble_breath.ml_service.service;

import com.bubble_breath.ml_service.dto.CreateImageRatingResponse;
import com.bubble_breath.ml_service.dto.ImageRatingDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ImageRatingService {

    CreateImageRatingResponse createAndClassify(Long userId, MultipartFile imageFile);

    ImageRatingDto getById(Long id);

    List<ImageRatingDto> getAll();

    ImageRatingDto update(Long id, ImageRatingDto dto);

    void delete(Long id);
}

