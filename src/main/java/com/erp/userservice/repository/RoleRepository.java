package com.erp.userservice.repository;

import com.erp.userservice.model.Role;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

/**
 * Role Repository - Uses stored procedures via JdbcTemplate (NO Hibernate/JPA)
 */
@Repository
public class RoleRepository {

    private final JdbcTemplate jdbcTemplate;

    public RoleRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Get all roles via stored procedure sp_get_all_roles
     */
    public List<Role> findAll() {
        String sql = "CALL sp_get_all_roles()";
        return jdbcTemplate.query(sql, (rs, rowNum) -> mapRowToRole(rs));
    }

    /**
     * Get role by ID via stored procedure sp_get_role_by_id
     */
    public Optional<Role> findById(Long id) {
        String sql = "CALL sp_get_role_by_id(?)";
        List<Role> roles = jdbcTemplate.query(sql, new Object[]{id}, (rs, rowNum) -> mapRowToRole(rs));
        return roles.isEmpty() ? Optional.empty() : Optional.of(roles.get(0));
    }

    /**
     * Find role by name (direct SQL query)
     */
    public Optional<Role> findByName(String name) {
        String sql = "SELECT id, name, description FROM roles WHERE name = ?";
        List<Role> roles = jdbcTemplate.query(sql, new Object[]{name}, (rs, rowNum) -> mapRowToRole(rs));
        return roles.isEmpty() ? Optional.empty() : Optional.of(roles.get(0));
    }

    /**
     * Save role (insert or update)
     */
    public Role save(Role role) {
        if (role.getId() != null && role.getId() > 0) {
            // Update existing role
            String sql = "UPDATE roles SET name = ?, description = ? WHERE id = ?";
            jdbcTemplate.update(sql, role.getName(), role.getDescription(), role.getId());
            return role;
        } else {
            // Insert new role
            String sql = "INSERT INTO roles (name, description) VALUES (?, ?)";
            jdbcTemplate.update(sql, role.getName(), role.getDescription());

            // Return role with generated ID
            Optional<Role> createdRole = findByName(role.getName());
            return createdRole.orElse(role);
        }
    }

    /**
     * Count total roles
     */
    public long count() {
        String sql = "SELECT COUNT(*) FROM roles";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count != null ? count.longValue() : 0;
    }

    /**
     * Delete role by ID
     */
    public void deleteById(Long id) {
        String sql = "DELETE FROM roles WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    /**
     * Map ResultSet row to Role object
     */
    private Role mapRowToRole(ResultSet rs) throws SQLException {
        Role role = new Role();
        role.setId(rs.getLong("id"));
        role.setName(rs.getString("name"));
        role.setDescription(rs.getString("description"));
        return role;
    }
}
