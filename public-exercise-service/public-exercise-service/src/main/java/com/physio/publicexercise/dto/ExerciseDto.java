package com.physio.publicexercise.dto;

public record ExerciseDto(
        String id,
        String title,
        String description,
        String videoUrl,
        int timerSeconds
) {}