package com.bubble_breath.game_service.controller;

import com.bubble_breath.game_service.dto.request.CategoryRequest;
import com.bubble_breath.game_service.dto.request.CategoryUpdateRequest;
import com.bubble_breath.game_service.dto.response.CategoryResponse;
import com.bubble_breath.game_service.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("Category")
@RestController
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> save(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse saved = categoryService.save(request);
        return ResponseEntity.ok(saved);
    }

    @PutMapping
    public ResponseEntity<CategoryResponse> update(@Valid @RequestBody CategoryUpdateRequest request) {
        CategoryResponse updated = categoryService.update(request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable("id") UUID id) {
        CategoryResponse get = categoryService.getById(id);
        if (get == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(get);
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getAll() {
        List<CategoryResponse> getAll = categoryService.getAll();
        return ResponseEntity.ok(getAll);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Integer> delete(@PathVariable("id") UUID id) {
        int deleted = categoryService.delete(id);
        if (deleted == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(deleted);
    }
}

