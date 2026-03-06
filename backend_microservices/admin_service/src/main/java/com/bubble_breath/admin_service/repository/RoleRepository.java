package com.bubble_breath.admin_service.repository;
import com.bubble_breath.admin_service.entity.Role;
import com.bubble_breath.admin_service.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(RoleName name);
}
