package com.bubble_breath.game_service.entity;

import com.bubble_breath.game_service.enums.Deleted;
import jakarta.persistence.*;
import lombok.Data;

import java.util.UUID;


@Entity
@Table(name = "GAME")
@Data
public class Game extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(unique = true, nullable = false, updatable = false)
    private UUID id;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 200, nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CATEGORY_ID", nullable = false)
    private Category category;

    @Column(name = "THUMBNAIL_URL")
    private String thumbnailUrl;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive;

    @Enumerated(EnumType.STRING)
    @Column(name = "IS_DELETED", nullable = false)
    private Deleted isDeleted;
}