package com.physio.publicexercise.controller;

import com.physio.publicexercise.model.Exercise;
import com.physio.publicexercise.service.PublicExerciseService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/admin/exercises")
@CrossOrigin
public class AdminExerciseController {

    private final PublicExerciseService service;

    public AdminExerciseController(PublicExerciseService service) {
        this.service = service;
    }

    // CRUD to satisfy "each member must have CRUD"
    @PostMapping
    public Exercise create(@Valid @RequestBody Exercise ex) {
        return service.create(ex);
    }

    @GetMapping
    public List<Exercise> listAll() {
        return service.listAll();
    }

    @PutMapping("/{id}")
    public Exercise update(@PathVariable String id, @Valid @RequestBody Exercise ex) {
        return service.update(id, ex);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}