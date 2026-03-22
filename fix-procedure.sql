-- Fix procedure: Update sp_update_user to use LONGTEXT for profile_photo
-- This script will drop and recreate the sp_update_user procedure with the correct parameter type

USE erp_dev;

    DELIMITER $$

-- Drop the old procedure
DROP PROCEDURE IF EXISTS `sp_update_user`$$

-- Create the new procedure with LONGTEXT support
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

DELIMITER ;

-- Verification query
SELECT ROUTINE_NAME, ROUTINE_TYPE, ROUTINE_DEFINITION 
FROM INFORMATION_SCHEMA.ROUTINES 
WHERE ROUTINE_SCHEMA = 'erp_dev' AND ROUTINE_NAME = 'sp_update_user'\G
