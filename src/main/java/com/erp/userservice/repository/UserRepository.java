package com.erp.userservice.repository;

import com.erp.userservice.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(value = "CALL list_users()", nativeQuery = true)
    List<User> listUsers();

    @Query(value = "CALL get_user(?1)", nativeQuery = true)
    User getUser(Long id);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO users(username, email, password, enabled) VALUES(?1, ?2, ?3, true)", nativeQuery = true)
    void createUserDirect(String username, String email, String password);

    @Modifying
    @Transactional
    @Query(value = "CALL create_user(?1, ?2, ?3)", nativeQuery = true)
    void createUser(String username, String email, String password);

    @Modifying
    @Transactional
    @Query(value = "CALL update_user(?1, ?2, ?3)", nativeQuery = true)
    void updateUser(Long id, String username, String email);

    @Modifying
    @Transactional
    @Query(value = "CALL delete_user(?1)", nativeQuery = true)
    void deleteUser(Long id);


}
