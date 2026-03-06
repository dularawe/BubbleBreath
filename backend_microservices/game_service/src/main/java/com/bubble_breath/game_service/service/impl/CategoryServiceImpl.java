package com.bubble_breath.game_service.service.impl;

import com.bubble_breath.game_service.dto.request.CategoryRequest;
import com.bubble_breath.game_service.dto.request.CategoryUpdateRequest;
import com.bubble_breath.game_service.dto.response.CategoryResponse;
import com.bubble_breath.game_service.entity.Category;
import com.bubble_breath.game_service.enums.Deleted;
import com.bubble_breath.game_service.repository.CategoryRepository;
import com.bubble_breath.game_service.service.CategoryService;
import com.bubble_breath.game_service.utils.ConvertUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    @Transactional
    public CategoryResponse save(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIsActive(request.getIsActive());
        category.setIsDeleted(Deleted.NO);
        Category saved = categoryRepository.save(category);
        return convert(saved);
    }

    @Override
    @Transactional
    public CategoryResponse update(CategoryUpdateRequest request) {
        Category category = categoryRepository.findById(request.getId()).orElse(null);
        if (category == null) {
            return null;
        }
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIsActive(request.getIsActive());
        Category updated = categoryRepository.save(category);
        return convert(updated);
    }

    @Override
    public CategoryResponse getById(UUID id) {
        return categoryRepository.findById(id).map(CategoryServiceImpl::convert).orElse(null);
    }

    @Override
    public List<CategoryResponse> getAll() {
        return categoryRepository.findByIsDeleted(Deleted.NO)
                .stream().map(CategoryServiceImpl::convert).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public Integer delete(UUID id) {
        Category category = categoryRepository.findById(id).orElse(null);
        if (category == null) {
            return 0;
        }
        category.setIsDeleted(Deleted.YES);
        categoryRepository.save(category);
        return 1;
    }

    private static CategoryResponse convert(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        response.setIsActive(category.getIsActive());
        response.setCreatedBy(category.getCreatedBy());
        response.setCreatedDateTime(ConvertUtils.convertDateToStr(category.getCreatedDateTime()));
        response.setModifiedBy(category.getModifiedBy());
        response.setModifiedDateTime(ConvertUtils.convertDateToStr(category.getModifiedDateTime()));
        response.setIsDeleted(category.getIsDeleted());
        return response;
    }
}
