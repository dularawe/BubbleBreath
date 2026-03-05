package com.bubble_breath.payment_service.repository;
import com.bubble_breath.payment_service.entity.Pyament;
import com.bubble_breath.payment_service.enums.IsDeleted;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import java.util.List;
import java.util.UUID;
public interface PyamentRepository extends JpaRepository<Pyament, UUID>, JpaSpecificationExecutor<Pyament> {
    List<Pyament> findByIsDeleted(IsDeleted isDeleted);
}
