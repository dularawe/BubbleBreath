package com.physio.publicexercise.controller;

import com.physio.publicexercise.model.Exercise;
import com.physio.publicexercise.service.PublicExerciseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin // for frontend
public class PublicExerciseController {

    private final PublicExerciseService service;

    public PublicExerciseController(PublicExerciseService service) {
        this.service = service;
    }

    // matches doc: GET /api/public/exercises :contentReference[oaicite:1]{index=1}
    @GetMapping("/exercises")
    public List<Exercise> listFreeExercises() {
        return service.listFree();
    }

    // matches doc: GET /api/public/exercise/:id :contentReference[oaicite:2]{index=2}
    @GetMapping("/exercise/{id}")
    public Exercise getExercise(@PathVariable String id) {
        return service.getFreeById(id);
    }
}