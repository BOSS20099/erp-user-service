-- Insert roles with descriptions and permissions
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Le rôle le plus puissant. Permissions: gérer les utilisateurs, assigner les rôles, accéder à tous les modules, configurer l ERP, voir tous les rapports'),
('MANAGER', 'Responsable opérationnel. Permissions: gérer clients, gérer produits, gérer ventes, consulter stocks, voir rapports'),
('VENTES', 'Commercial. Permissions: créer commandes, gérer clients, générer factures'),
('GESTIONNAIRE_ACHATS', 'Responsable des achats. Permissions: gérer fournisseurs, créer commandes d achats, suivre livraisons'),
('GESTIONNAIRE_STOCK', 'Responsable du stock/magasin. Permissions: gérer entrées/sorties, voir mouvements de stock, consulter produits'),
('COMPTABLE', 'Comptable de l entreprise. Permissions: gérer transactions, voir factures, rapports financiers'),
('GESTIONNAIRE_RH', 'Responsable ressources humaines. Permissions: gérer employés, gérer départements, consulter contrats');
