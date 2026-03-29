package com.physio.publicexercise.service;

import com.physio.publicexercise.dto.TrackRequest;
import com.physio.publicexercise.model.TrackSession;
import com.physio.publicexercise.store.SessionStore;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
public class TrackingService {

    private final SessionStore store;

    public TrackingService(SessionStore store) {
        this.store = store;
    }

    public TrackSession handle(TrackRequest req) {
        String sessionId = (req.getSessionId() == null || req.getSessionId().isBlank())
                ? UUID.randomUUID().toString()
                : req.getSessionId();

        Instant now = Instant.now();
        Instant expiresAt = now.plus(Duration.ofHours(2));

        TrackSession session = store.find(sessionId)
                .orElseGet(() -> new TrackSession(sessionId, req.getExerciseId(), now, expiresAt));

        session.setExerciseId(req.getExerciseId());
        session.setLastUpdatedAt(now);
        session.setExpiresAt(expiresAt);

        if (req.getReps() != null) session.setReps(req.getReps());
        if (req.getCorrectCount() != null) session.setCorrectCount(req.getCorrectCount());
        if (req.getIncorrectCount() != null) session.setIncorrectCount(req.getIncorrectCount());

        if (req.getEvent() == TrackRequest.Event.STOP) {
            store.delete(sessionId);
            return session; // return last snapshot
        }

        return store.upsert(session);
    }
}