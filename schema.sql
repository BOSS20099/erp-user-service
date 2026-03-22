

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `roles` (`id`, `name`, `description`) VALUES
(1, 'ADMIN', 'Le rôle le plus puissant. Permissions: gérer les utilisateurs, assigner les rôles, accéder à tous les modules, configurer l ERP, voir tous les rapports'),
(2, 'MANAGER', 'Responsable opérationnel. Permissions: gérer clients, gérer produits, gérer ventes, consulter stocks, voir rapports'),
(3, 'VENTES', 'Commercial. Permissions: créer commandes, gérer clients, générer factures'),
(4, 'GESTIONNAIRE_ACHATS', 'Responsable des achats. Permissions: gérer fournisseurs, créer commandes d achats, suivre livraisons'),
(5, 'GESTIONNAIRE_STOCK', 'Responsable du stock/magasin. Permissions: gérer entrées/sorties, voir mouvements de stock, consulter produits'),
(6, 'COMPTABLE', 'Comptable de l entreprise. Permissions: gérer transactions, voir factures, rapports financiers'),
(7, 'GESTIONNAIRE_RH', 'Responsable ressources humaines. Permissions: gérer employés, gérer départements, consulter contrats');



DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `users` (`id`, `username`, `email`, `password`, `enabled`, `created_at`) VALUES
(1, 'Meka', 'meka@gmail.com', '1234', 1, '2026-03-14 22:33:39'),
(5, 'Mendrika', 'mendrika@gmail.com', '1234', 1, '2026-03-14 20:55:12');



DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` bigint NOT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



INSERT INTO `user_roles` (`user_id`, `role_id`) VALUES
(3, 1),
(4, 2),
(5, 1);
COMMIT;

