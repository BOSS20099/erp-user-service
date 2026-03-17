package com.erp.userservice.repository;

import com.erp.userservice.model.UserRole;
import com.erp.userservice.model.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRoleId> {

    @Query(value = "SELECT * FROM user_roles WHERE user_id = ?1", nativeQuery = true)
    List<UserRole> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM user_roles WHERE user_id = ?1", nativeQuery = true)
    void deleteByUserId(Long userId);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO user_roles(user_id, role_id) VALUES(?1, ?2)", nativeQuery = true)
    void insertUserRole(Long userId, Long roleId);
}
