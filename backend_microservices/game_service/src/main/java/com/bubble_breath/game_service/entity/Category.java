package com.bubble_breath.game_service.entity;

import com.bubble_breath.game_service.enums.Deleted;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;

@Entity
@Table(name = "CATEGORY")
@Data
public class Category extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false, updatable = false)
    private UUID id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(length = 255)
    private String description;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    @Column(name = "IS_DELETED", nullable = false)
    private Deleted isDeleted;
}
