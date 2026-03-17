package com.erp.userservice.service;

import com.erp.userservice.dto.UserDTO;
import com.erp.userservice.model.Role;
import com.erp.userservice.model.User;
import com.erp.userservice.model.UserRole;
import com.erp.userservice.repository.RoleRepository;
import com.erp.userservice.repository.UserRepository;
import com.erp.userservice.repository.UserRoleRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, 
                      UserRoleRepository userRoleRepository,
                      RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
    }

    public List<User> getUsers() {
        return userRepository.listUsers();
    }

    public User getUser(Long id) {
        return userRepository.getUser(id);
    }

    public User createUser(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());
        user.setEnabled(true);
        
        // Save and return the user with generated ID
        return userRepository.save(user);
    }

    public User updateUser(Long id, UserDTO dto) {
        userRepository.updateUser(
                id,
                dto.getUsername(),
                dto.getEmail()
        );
        return getUser(id);
    }

    public void deleteUser(Long id) {
        userRepository.deleteUser(id);
    }

    public List<Role> getUserRoles(Long userId) {
        List<UserRole> userRoles = userRoleRepository.findByUserId(userId);
        List<Role> roles = new ArrayList<>();
        for (UserRole ur : userRoles) {
            roleRepository.findById(ur.getRoleId()).ifPresent(roles::add);
        }
        return roles;
    }

    public void assignRolesToUser(Long userId, Long[] roleIds) {
        // Delete existing roles for this user
        userRoleRepository.deleteByUserId(userId);
        
        // Assign new roles
        if (roleIds != null) {
            for (Long roleId : roleIds) {
                userRoleRepository.insertUserRole(userId, roleId);
            }
        }
    }

}
