package com.bubble_breath.game_service.repository;

import com.bubble_breath.game_service.entity.Game;
import com.bubble_breath.game_service.enums.Deleted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface GameRepository extends JpaRepository<Game, UUID>, JpaSpecificationExecutor<Game> {

    List<Game> findByIsDeleted(Deleted deleted);

}