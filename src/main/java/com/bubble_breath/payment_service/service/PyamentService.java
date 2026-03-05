package com.bubble_breath.payment_service.service;
import com.bubble_breath.payment_service.dto.request.PyamentRequest;
import com.bubble_breath.payment_service.dto.request.PyamentUpdateRequest;
import com.bubble_breath.payment_service.dto.response.PyamentResponse;
import java.util.List;
import java.util.UUID;
public interface PyamentService {
    PyamentResponse save(PyamentRequest request);
    PyamentResponse update(PyamentUpdateRequest request);
    PyamentResponse getById(UUID id);
    List<PyamentResponse> getAll();
    Integer delete(UUID id);
}
