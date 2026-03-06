package com.bubble_breath.achievment_service.controller;

import com.bubble_breath.achievment_service.dto.request.AchivementRequest;
import com.bubble_breath.achievment_service.dto.request.AchivementUpdateRequest;
import com.bubble_breath.achievment_service.dto.response.AchivementResponse;
import com.bubble_breath.achievment_service.service.AchivementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RequestMapping("Achivement")
@RestController
@CrossOrigin
public class AchivementController {

    @Autowired
    private AchivementService achivementService;

    @PostMapping
    public ResponseEntity<AchivementResponse> save(@Valid @RequestBody AchivementRequest request) {
        AchivementResponse save = achivementService.save(request);
        return ResponseEntity.ok(save);
    }

    @PutMapping
    public ResponseEntity<AchivementResponse> update(@Valid @RequestBody AchivementUpdateRequest request) {
        AchivementResponse updated = achivementService.update(request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("{id}")
    public ResponseEntity<AchivementResponse> getById(@PathVariable("id") UUID id) {
        AchivementResponse get = achivementService.getById(id);
        if (get == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(get);
    }

    @GetMapping()
    public ResponseEntity<List<AchivementResponse>> getAll() {
        List<AchivementResponse> getall = achivementService.getAll();
        return ResponseEntity.ok(getall);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id) {
        int deleted = achivementService.delete(id);
        if (deleted == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}