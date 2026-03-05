package com.bubble_breath.payment_service.service.impl;
import com.bubble_breath.payment_service.dto.request.PyamentRequest;
import com.bubble_breath.payment_service.dto.request.PyamentUpdateRequest;
import com.bubble_breath.payment_service.dto.response.PyamentResponse;
import com.bubble_breath.payment_service.entity.Pyament;
import com.bubble_breath.payment_service.enums.IsDeleted;
import com.bubble_breath.payment_service.repository.PyamentRepository;
import com.bubble_breath.payment_service.service.PyamentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class PyamentServiceImpl implements PyamentService {
    @Autowired
    private PyamentRepository pyamentRepository;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    @Override
    @Transactional
    public PyamentResponse save(PyamentRequest request) {
        Pyament pyament = new Pyament();
        pyament.setUserId(request.getUserId());
        pyament.setAmount(request.getAmount());
        pyament.setIsDeleted(IsDeleted.NO);
        Pyament save = pyamentRepository.save(pyament);
        return convert(save);
    }
    @Override
    @Transactional
    public PyamentResponse update(PyamentUpdateRequest request) {
        Pyament pyament = pyamentRepository.findById(request.getId()).orElse(null);
        if (pyament == null) {
            return null;
        }
        pyament.setUserId(request.getUserId());
        pyament.setAmount(request.getAmount());
        pyament.setStatus(request.getStatus());
        Pyament updated = pyamentRepository.save(pyament);
        return convert(updated);
    }
    @Override
    public PyamentResponse getById(UUID id) {
        return pyamentRepository.findById(id).map(PyamentServiceImpl::convert).orElse(null);
    }
    @Override
    public List<PyamentResponse> getAll() {
        return pyamentRepository.findByIsDeleted(IsDeleted.NO)
                .stream().map(PyamentServiceImpl::convert).collect(Collectors.toList());
    }
    @Override
    @Transactional
    public Integer delete(UUID id) {
        Pyament got = pyamentRepository.findById(id).orElse(null);
        if (got == null) {
            return 0;
        }
        got.setIsDeleted(IsDeleted.YES);
        pyamentRepository.save(got);
        return 1;
    }
    private static PyamentResponse convert(Pyament pyament) {
        PyamentResponse response = new PyamentResponse();
        response.setId(pyament.getId());
        response.setUserId(pyament.getUserId());
        response.setAmount(pyament.getAmount());
        response.setStatus(pyament.getStatus());
        response.setCreatedBy(pyament.getCreatedBy());
        response.setCreatedDateTime(convertDate(pyament.getCreatedDateTime()));
        response.setModifiedBy(pyament.getModifiedBy());
        response.setModifiedDateTime(convertDate(pyament.getModifiedDateTime()));
        response.setIsDeleted(pyament.getIsDeleted());
        return response;
    }
    private static String convertDate(Date date) {
        if (date == null) return null;
        return DATE_FORMAT.format(date);
    }
}
