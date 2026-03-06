package com.bubble_breath.game_service.repository;

import com.bubble_breath.game_service.entity.Category;
import com.bubble_breath.game_service.enums.Deleted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID>, JpaSpecificationExecutor<Category> {

    List<Category> findByIsDeleted(Deleted deleted);
}
