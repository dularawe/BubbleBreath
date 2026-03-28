package com.bubble_breath.review_service.controller;

import com.bubble_breath.review_service.dto.request.ReviewRequest;
import com.bubble_breath.review_service.dto.request.ReviewUpdateRequest;
import com.bubble_breath.review_service.dto.response.ReviewResponse;
import com.bubble_breath.review_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RequestMapping("Review")
@RestController
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponse> save(@Valid @RequestBody ReviewRequest request) {
        ReviewResponse save = reviewService.save(request);
        return ResponseEntity.ok(save);
    }

    @PutMapping
    public ResponseEntity<ReviewResponse> update(@Valid @RequestBody ReviewUpdateRequest request) {
        ReviewResponse updated = reviewService.update(request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("{id}")
    public ResponseEntity<ReviewResponse> getById(@PathVariable("id") UUID id) {
        ReviewResponse get = reviewService.getById(id);
        if (get == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(get);
    }

    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAll() {
        List<ReviewResponse> getall = reviewService.getAll();
        return ResponseEntity.ok(getall);
    }

    @GetMapping("game/{gameId}")
    public ResponseEntity<List<ReviewResponse>> getByGameId(@PathVariable("gameId") UUID gameId) {
        List<ReviewResponse> reviews = reviewService.getByGameId(gameId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getByUserId(@PathVariable("userId") UUID userId) {
        List<ReviewResponse> reviews = reviewService.getByUserId(userId);
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id) {
        int deleted = reviewService.delete(id);
        if (deleted == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}