package com.erp.userservice.repository;

import com.erp.userservice.model.UserRole;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * UserRole Repository - Uses stored procedures via JdbcTemplate (NO Hibernate/JPA)
 */
@Repository
public class UserRoleRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRoleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Get user roles by user ID (direct SQL query)
     */
    public List<UserRole> findByUserId(Long userId) {
        String sql = "SELECT user_id, role_id FROM user_roles WHERE user_id = ?";
        return jdbcTemplate.query(sql, new Object[]{userId}, (rs, rowNum) -> mapRowToUserRole(rs));
    }

    /**
     * Delete all user roles via stored procedure sp_delete_user_roles
     */
    public void deleteByUserId(Long userId) {
        String sql = "CALL sp_delete_user_roles(?)";
        jdbcTemplate.update(sql, userId);
    }

    /**
     * Insert user role via stored procedure sp_assign_role_to_user
     */
    public void insertUserRole(Long userId, Long roleId) {
        String sql = "CALL sp_assign_role_to_user(?, ?)";
        jdbcTemplate.update(sql, userId, roleId);
    }

    /**
     * Map ResultSet row to UserRole object
     */
    private UserRole mapRowToUserRole(ResultSet rs) throws SQLException {
        UserRole userRole = new UserRole();
        userRole.setUserId(rs.getLong("user_id"));
        userRole.setRoleId(rs.getLong("role_id"));
        return userRole;
    }
}
