package com.physio.publicexercise.service;

import com.physio.publicexercise.dto.ExerciseDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PublicExerciseService {

    public List<ExerciseDto> getFreeExercises() {

        return List.of(

                new ExerciseDto(
                        "1",
                        "Monster Jump",
                        "Jumping jacks exercise",
                        "https://example.com/jumping-jacks.mp4",
                        60
                ),

                new ExerciseDto(
                        "2",
                        "Stretch Monster",
                        "Arm stretching exercise",
                        "https://example.com/arm-stretch.mp4",
                        45
                ),

                new ExerciseDto(
                        "3",
                        "Balance Bridge",
                        "Balance on one leg exercise",
                        "https://example.com/balance.mp4",
                        30
                )
        );
    }
}