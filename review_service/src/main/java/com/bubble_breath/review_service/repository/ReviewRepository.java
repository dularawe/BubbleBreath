package com.bubble_breath.review_service.repository;

import com.bubble_breath.review_service.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByIsDeleted(Boolean isDeleted);

    List<Review> findByGameIdAndIsDeleted(UUID gameId, Boolean isDeleted);

    List<Review> findByUserIdAndIsDeleted(UUID userId, Boolean isDeleted);
}