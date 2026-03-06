package com.bubble_breath.challenge_service.repository;

import com.bubble_breath.challenge_service.entity.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ChallengeRepository extends JpaRepository<Challenge, UUID> {
}