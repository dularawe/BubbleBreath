package com.physio.publicexercise.service;

import com.physio.publicexercise.model.Exercise;
import com.physio.publicexercise.store.ExerciseStore;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PublicExerciseService {

    private final ExerciseStore store;

    public PublicExerciseService(ExerciseStore store) {
        this.store = store;
    }

    @PostConstruct
    void seed3FreeExercises() {
        // only 3 free exercises (as requirement)
        store.seed(List.of(
                new Exercise("ex1", "Monster Jump (Jumping Jacks)", 30,
                        "https://example.com/videos/jumping-jacks.mp4",
                        List.of("Stand straight", "Arms up + legs apart", "Return to start"), true),
                new Exercise("ex2", "Stretch Monster (Arm Stretches)", 40,
                        "https://example.com/videos/arm-stretch.mp4",
                        List.of("Raise arms", "Hold stretch", "Keep shoulders relaxed"), true),
                new Exercise("ex3", "Balance Bridge (Balance Pose)", 45,
                        "https://example.com/videos/balance.mp4",
                        List.of("Stand on one leg", "Keep core tight", "Hold steady"), true)
        ));
    }

    public List<Exercise> listFree() {
        return store.findAll().stream().filter(Exercise::isFree).toList();
    }

    public Exercise getFreeById(String id) {
        return store.findById(id)
                .filter(Exercise::isFree)
                .orElseThrow(() -> new RuntimeException("Exercise not found"));
    }

    // CRUD for admin
    public Exercise create(Exercise ex) {
        if (ex.getId() == null || ex.getId().isBlank()) {
            ex.setId(UUID.randomUUID().toString());
        }
        return store.save(ex);
    }

    public Exercise update(String id, Exercise ex) {
        if (!store.exists(id)) throw new RuntimeException("Exercise not found");
        ex.setId(id);
        return store.save(ex);
    }

    public void delete(String id) {
        store.delete(id);
    }

    public List<Exercise> listAll() {
        return store.findAll();
    }
}