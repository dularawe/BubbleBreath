package com.bubble_breath.ml_service.dto;

public class CreateImageRatingResponse {

    private Long id;
    private Long userId;
    private String label;
    private Double score;
    private String imageUrl;

    public CreateImageRatingResponse() {
    }

    public CreateImageRatingResponse(Long id, Long userId, String label, Double score, String imageUrl) {
        this.id = id;
        this.userId = userId;
        this.label = label;
        this.score = score;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

