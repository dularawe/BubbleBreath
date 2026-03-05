package com.physio.publicexercise.controller;

import com.physio.publicexercise.dto.ExerciseDto;
import com.physio.publicexercise.service.PublicExerciseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicExerciseController {

    private final PublicExerciseService service;

    public PublicExerciseController(PublicExerciseService service) {
        this.service = service;
    }

    @GetMapping("/exercises")
    public List<ExerciseDto> getExercises() {
        return service.getFreeExercises();
    }
}