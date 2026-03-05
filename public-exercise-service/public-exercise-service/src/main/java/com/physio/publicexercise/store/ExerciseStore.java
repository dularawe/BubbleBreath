package com.physio.publicexercise.store;

import com.physio.publicexercise.model.Exercise;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ExerciseStore {
    private final Map<String, Exercise> exercises = new ConcurrentHashMap<>();

    public List<Exercise> findAll() {
        return new ArrayList<>(exercises.values());
    }

    public Optional<Exercise> findById(String id) {
        return Optional.ofNullable(exercises.get(id));
    }

    public Exercise save(Exercise ex) {
        exercises.put(ex.getId(), ex);
        return ex;
    }

    public void delete(String id) {
        exercises.remove(id);
    }

    public boolean exists(String id) {
        return exercises.containsKey(id);
    }

    public void seed(List<Exercise> list) {
        for (Exercise e : list) save(e);
    }
}