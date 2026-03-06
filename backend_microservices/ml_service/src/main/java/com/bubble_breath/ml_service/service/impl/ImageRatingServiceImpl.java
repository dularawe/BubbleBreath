package com.bubble_breath.ml_service.service.impl;

import com.bubble_breath.ml_service.dto.CreateImageRatingResponse;
import com.bubble_breath.ml_service.dto.ImageRatingDto;
import com.bubble_breath.ml_service.entity.ImageRating;
import com.bubble_breath.ml_service.repository.ImageRatingRepository;
import com.bubble_breath.ml_service.service.ImageRatingService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@Transactional
public class ImageRatingServiceImpl implements ImageRatingService {

    private final ImageRatingRepository imageRatingRepository;
    private final WebClient webClient;

    @Value("${ml.api.url}")
    private String mlApiUrl;

    @Value("${ml.api.api-key}")
    private String mlApiKey;

    public ImageRatingServiceImpl(ImageRatingRepository imageRatingRepository, WebClient.Builder webClientBuilder) {
        this.imageRatingRepository = imageRatingRepository;
        this.webClient = webClientBuilder.build();
    }

    @Override
    public CreateImageRatingResponse createAndClassify(Long userId, MultipartFile imageFile) {
        byte[] bytes;
        try {
            bytes = imageFile.getBytes();
        } catch (IOException e) {
            throw new IllegalArgumentException("Unable to read image file", e);
        }

        MlApiResponse mlResponse = webClient.post()
                .uri(mlApiUrl)
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .header("Authorization", "Bearer " + mlApiKey)
                .body(BodyInserters.fromMultipartData("file", bytes))
                .retrieve()
                .bodyToMono(MlApiResponse.class)
                .block();

        if (mlResponse == null || mlResponse.getLabel() == null || mlResponse.getScore() == null) {
            throw new IllegalStateException("Invalid response from ML API");
        }

        ImageRating rating = new ImageRating();
        rating.setUserId(userId);
        rating.setLabel(mlResponse.getLabel());
        rating.setScore(mlResponse.getScore());
        rating.setImageUrl(null);

        ImageRating saved = imageRatingRepository.save(rating);

        return new CreateImageRatingResponse(
                saved.getId(),
                saved.getUserId(),
                saved.getLabel(),
                saved.getScore(),
                saved.getImageUrl()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ImageRatingDto getById(Long id) {
        ImageRating rating = imageRatingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ImageRating not found: " + id));
        return toDto(rating);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageRatingDto> getAll() {
        return imageRatingRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public ImageRatingDto update(Long id, ImageRatingDto dto) {
        ImageRating rating = imageRatingRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ImageRating not found: " + id));

        rating.setLabel(dto.getLabel());
        rating.setScore(dto.getScore());
        rating.setImageUrl(dto.getImageUrl());

        ImageRating saved = imageRatingRepository.save(rating);
        return toDto(saved);
    }

    @Override
    public void delete(Long id) {
        if (!imageRatingRepository.existsById(id)) {
            throw new NoSuchElementException("ImageRating not found: " + id);
        }
        imageRatingRepository.deleteById(id);
    }

    private ImageRatingDto toDto(ImageRating rating) {
        ImageRatingDto dto = new ImageRatingDto();
        dto.setId(rating.getId());
        dto.setUserId(rating.getUserId());
        dto.setLabel(rating.getLabel());
        dto.setScore(rating.getScore());
        dto.setImageUrl(rating.getImageUrl());
        return dto;
    }

    public static class MlApiResponse {
        private String label;
        private Double score;

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public Double getScore() {
            return score;
        }

        public void setScore(Double score) {
            this.score = score;
        }
    }
}

