package com.bubble_breath.ml_service.repository;

import com.bubble_breath.ml_service.entity.ImageRating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRatingRepository extends JpaRepository<ImageRating, Long> {
}

