package com.bubble_breath.ml_service.controller;

import com.bubble_breath.ml_service.dto.CreateImageRatingResponse;
import com.bubble_breath.ml_service.dto.ImageRatingDto;
import com.bubble_breath.ml_service.service.ImageRatingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ml/image-ratings")
public class ImageRatingController {

    private final ImageRatingService imageRatingService;

    public ImageRatingController(ImageRatingService imageRatingService) {
        this.imageRatingService = imageRatingService;
    }

    @PostMapping(path = "/classify", consumes = {"multipart/form-data"})
    public ResponseEntity<CreateImageRatingResponse> classifyAndCreate(
            @RequestParam("userId") Long userId,
            @RequestPart("image") MultipartFile imageFile
    ) {
        CreateImageRatingResponse response = imageRatingService.createAndClassify(userId, imageFile);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImageRatingDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(imageRatingService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<ImageRatingDto>> getAll() {
        return ResponseEntity.ok(imageRatingService.getAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImageRatingDto> update(
            @PathVariable Long id,
            @Valid @RequestBody ImageRatingDto dto
    ) {
        return ResponseEntity.ok(imageRatingService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        imageRatingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

