package com.erp.userservice.config;

import com.erp.userservice.model.Role;
import com.erp.userservice.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeRoles(RoleRepository roleRepository) {
        return args -> {
            // Create roles only if they don't exist
            if (roleRepository.count() == 0) {
                Role[] roles = {
                    createRole("ADMIN", "Le rôle le plus puissant. Permissions: gérer les utilisateurs, assigner les rôles, accéder à tous les modules, configurer l ERP, voir tous les rapports"),
                    createRole("MANAGER", "Responsable opérationnel. Permissions: gérer clients, gérer produits, gérer ventes, consulter stocks, voir rapports"),
                    createRole("GESTIONNAIRE_RH", "Responsable ressources humaines. Permissions: gérer employés, gérer départements, consulter contrats"),
                    createRole("COMPTABLE", "Comptable de l entreprise. Permissions: gérer transactions, voir factures, rapports financiers"),
                    createRole("GESTIONNAIRE_ACHATS", "Responsable des achats. Permissions: gérer fournisseurs, créer commandes d achats, suivre livraisons"),
                    createRole("GESTIONNAIRE_STOCK", "Responsable du stock/magasin. Permissions: gérer entrées/sorties, voir mouvements de stock, consulter produits"),
                    createRole("VENTES", "Commercial. Permissions: créer commandes, gérer clients, générer factures")
                };

                for (Role role : roles) {
                    roleRepository.save(role);
                }

                System.out.println("✓ Roles initialized successfully!");
            }
        };
    }

    private static Role createRole(String name, String description) {
        Role role = new Role();
        role.setName(name);
        role.setDescription(description);
        return role;
    }
}
