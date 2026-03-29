package com.physio.publicexercise.controller;

import com.physio.publicexercise.dto.TrackRequest;
import com.physio.publicexercise.model.TrackSession;
import com.physio.publicexercise.service.TrackingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@CrossOrigin
public class TrackingController {

    private final TrackingService trackingService;

    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }

    // matches doc: POST /api/public/track :contentReference[oaicite:3]{index=3}
    @PostMapping("/track")
    public TrackSession track(@Valid @RequestBody TrackRequest request) {
        return trackingService.handle(request);
    }
}