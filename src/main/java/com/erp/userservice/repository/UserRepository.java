package com.erp.userservice.repository;

import com.erp.userservice.model.User;
import org.springframework.jdbc.core.CallableStatementCreator;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.CallableStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;
import java.util.List;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Get paginated users via stored procedure
     */
    public PaginatedResult<User> getUsersPaginated(int page, int size, String sortBy) {
        // Get total count
        String countSql = "SELECT COUNT(*) FROM users";
        int totalElements = jdbcTemplate.queryForObject(countSql, Integer.class);
        
        // Calculate offset
        int offset = page * size;
        
        // Get users with pagination using stored procedure
        String sql = "CALL sp_get_users_paginated(?, ?, ?)";
        List<User> users = jdbcTemplate.query(sql, new Object[]{offset, size, sortBy}, (rs, rowNum) -> mapRowToUser(rs));
        
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        return new PaginatedResult<>(users, page, size, totalElements, totalPages);
    }

    /**
     * Search users with pagination via stored procedure
     */
    public PaginatedResult<User> searchUsersPaginated(String search, int page, int size, String sortBy) {
        // Get total count with search
        String countSql = "SELECT COUNT(*) FROM users WHERE LOWER(username) LIKE LOWER(?) OR LOWER(email) LIKE LOWER(?)";
        String searchPattern = "%" + search + "%";
        int totalElements = jdbcTemplate.queryForObject(countSql, new Object[]{searchPattern, searchPattern}, Integer.class);
        
        // Calculate offset
        int offset = page * size;
        
        // Get users with pagination and search using stored procedure
        String sql = "CALL sp_search_users_paginated(?, ?, ?, ?)";
        List<User> users = jdbcTemplate.query(sql, new Object[]{searchPattern, offset, size, sortBy}, (rs, rowNum) -> mapRowToUser(rs));
        
        int totalPages = (int) Math.ceil((double) totalElements / size);
        
        return new PaginatedResult<>(users, page, size, totalElements, totalPages);
    }

    /**
     * Get user by ID via stored procedure
     */
    public User getUser(Long id) {
        String sql = "CALL sp_get_user_by_id(?)";
        List<User> users = jdbcTemplate.query(sql, new Object[]{id}, (rs, rowNum) -> mapRowToUser(rs));
        return users.isEmpty() ? null : users.get(0);
    }

    /**
     * Create user via stored procedure
     */
    public User save(User user) {
        Long[] generatedId = new Long[1];
        
        try {
            jdbcTemplate.execute((CallableStatementCreator) con -> {
                CallableStatement cs = con.prepareCall("{CALL sp_create_user(?, ?, ?, ?, ?, ?)}");
                cs.setString(1, user.getUsername());
                cs.setString(2, user.getEmail());
                cs.setString(3, user.getPassword());
                cs.setBoolean(4, user.getEnabled() != null ? user.getEnabled() : true);
                cs.setString(5, user.getProfilePhoto());
                cs.registerOutParameter(6, Types.BIGINT);
                return cs;
            }, (CallableStatement cs) -> {
                cs.executeUpdate();
                generatedId[0] = cs.getLong(6);
                return null;
            });
        } catch (Exception e) {
            throw new RuntimeException("Error creating user: " + e.getMessage(), e);
        }

        return getUser(generatedId[0]);
    }

    /**
     * Update user via stored procedure
     */
    public void updateUser(Long id, String username, String email, String profilePhoto) {
        String sql = "CALL sp_update_user(?, ?, ?, ?)";
        jdbcTemplate.update(sql, id, username, email, profilePhoto);
    }

    /**
     * Delete user via stored procedure
     */
    public void deleteUser(Long id) {
        String sql = "CALL sp_delete_user(?)";
        jdbcTemplate.update(sql, id);
    }

    /**
     * Map ResultSet row to User object
     */
    private User mapRowToUser(ResultSet rs) throws SQLException {
        User user = new User();
        user.setId(rs.getLong("id"));
        user.setUsername(rs.getString("username"));
        user.setEmail(rs.getString("email"));
        user.setPassword(rs.getString("password"));
        user.setEnabled(rs.getBoolean("enabled"));
        try {
            user.setProfilePhoto(rs.getString("profilePhoto"));
        } catch (Exception e) {
            user.setProfilePhoto(null);
        }

        java.sql.Timestamp timestamp = rs.getTimestamp("created_at");
        if (timestamp != null) {
            user.setCreatedAt(timestamp.toLocalDateTime());
        }

        return user;
    }

    /**
     * Custom paginated result class
     */
    public static class PaginatedResult<T> {
        private final List<T> content;
        private final int page;
        private final int size;
        private final int totalElements;
        private final int totalPages;

        public PaginatedResult(List<T> content, int page, int size, int totalElements, int totalPages) {
            this.content = content;
            this.page = page;
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
        }

        public List<T> getContent() {
            return content;
        }

        public int getPage() {
            return page;
        }

        public int getSize() {
            return size;
        }

        public int getTotalElements() {
            return totalElements;
        }

        public int getTotalPages() {
            return totalPages;
        }

        public boolean isFirst() {
            return page == 0;
        }

        public boolean isLast() {
            return page >= totalPages - 1;
        }

        public boolean hasNext() {
            return page < totalPages - 1;
        }

        public boolean hasPrevious() {
            return page > 0;
        }
    }
}
