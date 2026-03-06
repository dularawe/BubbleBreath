package com.bubble_breath.achievment_service.repository;

import com.bubble_breath.achievment_service.entity.Achivement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AchivementRepository extends JpaRepository<Achivement, UUID> {
}