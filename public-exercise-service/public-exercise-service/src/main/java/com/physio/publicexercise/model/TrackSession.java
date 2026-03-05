package com.physio.publicexercise.model;

import java.time.Instant;

public class TrackSession {
    private String sessionId;
    private String exerciseId;
    private int reps;
    private int correctCount;
    private int incorrectCount;
    private Instant startedAt;
    private Instant lastUpdatedAt;
    private Instant expiresAt;

    public TrackSession() {}

    public TrackSession(String sessionId, String exerciseId, Instant startedAt, Instant expiresAt) {
        this.sessionId = sessionId;
        this.exerciseId = exerciseId;
        this.startedAt = startedAt;
        this.lastUpdatedAt = startedAt;
        this.expiresAt = expiresAt;
    }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getExerciseId() { return exerciseId; }
    public void setExerciseId(String exerciseId) { this.exerciseId = exerciseId; }

    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }

    public int getCorrectCount() { return correctCount; }
    public void setCorrectCount(int correctCount) { this.correctCount = correctCount; }

    public int getIncorrectCount() { return incorrectCount; }
    public void setIncorrectCount(int incorrectCount) { this.incorrectCount = incorrectCount; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }

    public Instant getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(Instant lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }

    public Instant getExpiresAt() { return expiresAt; }
    public void setExpiresAt(Instant expiresAt) { this.expiresAt = expiresAt; }
}