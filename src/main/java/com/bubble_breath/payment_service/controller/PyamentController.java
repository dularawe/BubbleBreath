package com.bubble_breath.payment_service.controller;
import com.bubble_breath.payment_service.dto.request.PyamentRequest;
import com.bubble_breath.payment_service.dto.request.PyamentUpdateRequest;
import com.bubble_breath.payment_service.dto.response.PyamentResponse;
import com.bubble_breath.payment_service.service.PyamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
@RequestMapping("/Payment")
@RestController
@CrossOrigin
public class PyamentController {
    @Autowired
    private PyamentService pyamentService;
    @PostMapping
    public ResponseEntity<PyamentResponse> save(@Valid @RequestBody PyamentRequest request) {
        PyamentResponse save = pyamentService.save(request);
        return ResponseEntity.ok(save);
    }
    @PutMapping
    public ResponseEntity<PyamentResponse> update(@Valid @RequestBody PyamentUpdateRequest request) {
        PyamentResponse updated = pyamentService.update(request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
    @GetMapping("{id}")
    public ResponseEntity<PyamentResponse> getById(@PathVariable("id") UUID id) {
        PyamentResponse get = pyamentService.getById(id);
        if (get == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(get);
    }
    @GetMapping
    public ResponseEntity<List<PyamentResponse>> getAll() {
        List<PyamentResponse> getall = pyamentService.getAll();
        return ResponseEntity.ok(getall);
    }
    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id) {
        int deleted = pyamentService.delete(id);
        if (deleted == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}
