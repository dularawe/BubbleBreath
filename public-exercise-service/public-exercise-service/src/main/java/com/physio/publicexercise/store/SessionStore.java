package com.physio.publicexercise.store;

import com.physio.publicexercise.model.TrackSession;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class SessionStore {
    private final ConcurrentHashMap<String, TrackSession> sessions = new ConcurrentHashMap<>();

    public TrackSession upsert(TrackSession s) {
        sessions.put(s.getSessionId(), s);
        return s;
    }

    public Optional<TrackSession> find(String sessionId) {
        return Optional.ofNullable(sessions.get(sessionId));
    }

    public void delete(String sessionId) {
        sessions.remove(sessionId);
    }

    public void cleanupExpired() {
        Instant now = Instant.now();
        sessions.values().removeIf(s -> s.getExpiresAt() != null && s.getExpiresAt().isBefore(now));
    }
}