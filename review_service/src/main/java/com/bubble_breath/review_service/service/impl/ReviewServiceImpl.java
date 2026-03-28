package com.bubble_breath.review_service.service.impl;

import com.bubble_breath.review_service.dto.request.ReviewRequest;
import com.bubble_breath.review_service.dto.request.ReviewUpdateRequest;
import com.bubble_breath.review_service.dto.response.ReviewResponse;
import com.bubble_breath.review_service.entity.Review;
import com.bubble_breath.review_service.repository.ReviewRepository;
import com.bubble_breath.review_service.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Override
    @Transactional
    public ReviewResponse save(ReviewRequest request) {
        Review review = new Review();
        review.setUserId(request.getUserId());
        review.setGameId(request.getGameId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setIsDeleted(false);
        Review saved = reviewRepository.save(review);
        return convert(saved);
    }

    @Override
    @Transactional
    public ReviewResponse update(ReviewUpdateRequest request) {
        Review review = reviewRepository.findById(request.getId()).orElse(null);
        if (review == null || review.getIsDeleted()) {
            return null;
        }
        if (request.getRating() != null) {
            review.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            review.setComment(request.getComment());
        }
        Review updated = reviewRepository.save(review);
        return convert(updated);
    }

    @Override
    public ReviewResponse getById(UUID id) {
        return reviewRepository.findById(id)
                .filter(r -> !r.getIsDeleted())
                .map(ReviewServiceImpl::convert)
                .orElse(null);
    }

    @Override
    public List<ReviewResponse> getAll() {
        return reviewRepository.findByIsDeleted(false)
                .stream().map(ReviewServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getByGameId(UUID gameId) {
        return reviewRepository.findByGameIdAndIsDeleted(gameId, false)
                .stream().map(ReviewServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getByUserId(UUID userId) {
        return reviewRepository.findByUserIdAndIsDeleted(userId, false)
                .stream().map(ReviewServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Integer delete(UUID id) {
        Review got = reviewRepository.findById(id).orElse(null);
        if (got == null || got.getIsDeleted()) {
            return 0;
        }
        got.setIsDeleted(true);
        reviewRepository.save(got);
        return 1;
    }

    private static ReviewResponse convert(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserId(review.getUserId());
        response.setGameId(review.getGameId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedDateTime(review.getCreatedDateTime());
        response.setModifiedDateTime(review.getModifiedDateTime());
        return response;
    }
}