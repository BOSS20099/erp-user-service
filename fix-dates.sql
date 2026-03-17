-- Fix existing user dates
-- Ajustez les dates des utilisateurs existants si nécessaire
-- Décommentez et exécutez si vous avez besoin de corriger les dates passées

-- UPDATE users 
-- SET created_at = DATE_ADD(created_at, INTERVAL 3 HOUR) 
-- WHERE created_at IS NOT NULL AND YEAR(created_at) = 2026;

-- Assurez-vous que la colonne created_at a CURRENT_TIMESTAMP comme valeur par défaut
-- (cela devrait être fait automatiquement par Hibernate avec les annotations @PrePersist)

-- Pour les nouveaux utilisateurs (après cette correction), les dates seront automatiquement définies correctement
-- via l'annotation @PrePersist dans la classe User.java
