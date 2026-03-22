USE erp_dev;

DELIMITER $$

DROP PROCEDURE IF EXISTS `sp_get_all_users`$$
CREATE PROCEDURE `sp_get_all_users` ()
BEGIN
    SELECT id, username, email, password, enabled, profile_photo AS profilePhoto, created_at 
    FROM users 
    ORDER BY created_at DESC;
END$$

DROP PROCEDURE IF EXISTS `sp_get_user_by_id`$$
CREATE PROCEDURE `sp_get_user_by_id` (IN p_user_id BIGINT)
BEGIN
    SELECT id, username, email, password, enabled, profile_photo AS profilePhoto, created_at 
    FROM users 
    WHERE id = p_user_id;
END$$

DROP PROCEDURE IF EXISTS `sp_create_user`$$
CREATE PROCEDURE `sp_create_user` (
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_enabled TINYINT,
    IN p_profile_photo LONGTEXT,
    OUT p_new_id BIGINT
)
BEGIN
    INSERT INTO users (username, email, password, enabled, profile_photo) 
    VALUES (p_username, p_email, p_password, p_enabled, p_profile_photo);
    SET p_new_id = LAST_INSERT_ID();
END$$

DROP PROCEDURE IF EXISTS `sp_update_user`$$
CREATE PROCEDURE `sp_update_user` (
    IN p_user_id BIGINT,
    IN p_username VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_profile_photo LONGTEXT
)
BEGIN
    UPDATE users 
    SET username = p_username, 
        email = p_email,
        profile_photo = p_profile_photo
    WHERE id = p_user_id;
END$$

DROP PROCEDURE IF EXISTS `sp_delete_user`$$
CREATE PROCEDURE `sp_delete_user` (IN p_user_id BIGINT)
BEGIN
    DELETE FROM user_roles WHERE user_id = p_user_id;
    DELETE FROM users WHERE id = p_user_id;
END$$

DROP PROCEDURE IF EXISTS `sp_get_all_roles`$$
CREATE PROCEDURE `sp_get_all_roles` ()
BEGIN
    SELECT id, name, description 
    FROM roles 
    ORDER BY name;
END$$

DROP PROCEDURE IF EXISTS `sp_get_role_by_id`$$
CREATE PROCEDURE `sp_get_role_by_id` (IN p_role_id BIGINT)
BEGIN
    SELECT id, name, description 
    FROM roles 
    WHERE id = p_role_id;
END$$

DROP PROCEDURE IF EXISTS `sp_get_user_roles`$$
CREATE PROCEDURE `sp_get_user_roles` (IN p_user_id BIGINT)
BEGIN
    SELECT r.id, r.name, r.description 
    FROM roles r
    INNER JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = p_user_id
    ORDER BY r.name;
END$$

DROP PROCEDURE IF EXISTS `sp_assign_role_to_user`$$
CREATE PROCEDURE `sp_assign_role_to_user` (
    IN p_user_id BIGINT,
    IN p_role_id BIGINT
)
BEGIN
    INSERT IGNORE INTO user_roles (user_id, role_id) 
    VALUES (p_user_id, p_role_id);
END$$

DROP PROCEDURE IF EXISTS `sp_delete_user_roles`$$
CREATE PROCEDURE `sp_delete_user_roles` (IN p_user_id BIGINT)
BEGIN
    DELETE FROM user_roles WHERE user_id = p_user_id;
END$$


-- Pagination procedures

DROP PROCEDURE IF EXISTS `sp_get_users_paginated`$$
CREATE PROCEDURE `sp_get_users_paginated` (
    IN p_offset INT,
    IN p_limit INT,
    IN p_sort_by VARCHAR(50)
)
BEGIN
    IF p_sort_by = 'username' THEN
        SET @sort_col = 'username';
    ELSEIF p_sort_by = 'email' THEN
        SET @sort_col = 'email';
    ELSEIF p_sort_by = 'created_at' THEN
        SET @sort_col = 'created_at';
    ELSE
        SET @sort_col = 'id';
    END IF;
    
    SET @q = CONCAT('SELECT id, username, email, password, enabled, profile_photo AS profilePhoto, created_at FROM users ORDER BY ', @sort_col, ' LIMIT ', p_limit, ' OFFSET ', p_offset);
    PREPARE stmt FROM @q;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$


DROP PROCEDURE IF EXISTS `sp_search_users_paginated`$$
CREATE PROCEDURE `sp_search_users_paginated` (
    IN p_search VARCHAR(255),
    IN p_offset INT,
    IN p_limit INT,
    IN p_sort_by VARCHAR(50)
)
BEGIN
    IF p_sort_by = 'username' THEN
        SET @sort_col = 'username';
    ELSEIF p_sort_by = 'email' THEN
        SET @sort_col = 'email';
    ELSEIF p_sort_by = 'created_at' THEN
        SET @sort_col = 'created_at';
    ELSE
        SET @sort_col = 'id';
    END IF;
    
    SET @search_pat = CONCAT('%', p_search, '%');
    SET @q = CONCAT('SELECT id, username, email, password, enabled, profile_photo AS profilePhoto, created_at FROM users WHERE LOWER(username) LIKE LOWER(''%', p_search, '%'') OR LOWER(email) LIKE LOWER(''%', p_search, '%'') ORDER BY ', @sort_col, ' LIMIT ', p_limit, ' OFFSET ', p_offset);
    PREPARE stmt FROM @q;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END$$

DELIMITER ;
