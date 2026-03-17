-- phpMyAdmin SQL Dump
-- Procédures stockées pour erp_dev

DELIMITER $$

--
-- Procédure : create_user
-- Description : Crée un nouvel utilisateur
--
DROP PROCEDURE IF EXISTS `create_user`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `create_user` (IN `p_username` VARCHAR(50), IN `p_email` VARCHAR(100), IN `p_password` VARCHAR(255))   BEGIN
INSERT INTO users(username,email,password,enabled)
VALUES(p_username,p_email,p_password,true);
END$$

--
-- Procédure : delete_user
-- Description : Supprime un utilisateur par son ID
--
DROP PROCEDURE IF EXISTS `delete_user`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_user` (IN `p_id` BIGINT)   BEGIN
DELETE FROM users WHERE id=p_id;
END$$

--
-- Procédure : get_user
-- Description : Récupère un utilisateur par son ID
--
DROP PROCEDURE IF EXISTS `get_user`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user` (IN `p_id` BIGINT)   BEGIN
SELECT * FROM users WHERE id=p_id;
END$$

--
-- Procédure : list_users
-- Description : Liste tous les utilisateurs
--
DROP PROCEDURE IF EXISTS `list_users`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `list_users` ()   BEGIN
SELECT * FROM users;
END$$

--
-- Procédure : update_user
-- Description : Met à jour un utilisateur
--
DROP PROCEDURE IF EXISTS `update_user`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `update_user` (IN `p_id` BIGINT, IN `p_username` VARCHAR(50), IN `p_email` VARCHAR(100))   BEGIN
UPDATE users
SET username=p_username,
email=p_email
WHERE id=p_id;
END$$

DELIMITER ;
