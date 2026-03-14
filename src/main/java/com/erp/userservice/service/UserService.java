package com.erp.userservice.service;

import com.erp.userservice.dto.UserDTO;
import com.erp.userservice.model.User;
import com.erp.userservice.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.listUsers();
    }

    public User getUser(Long id) {
        return userRepository.getUser(id);
    }

    public void createUser(UserDTO dto) {
        userRepository.createUser(
                dto.getUsername(),
                dto.getEmail(),
                dto.getPassword()
        );
    }

    public void updateUser(Long id, UserDTO dto) {
        userRepository.updateUser(
                id,
                dto.getUsername(),
                dto.getEmail()
        );
    }

    public void deleteUser(Long id) {
        userRepository.deleteUser(id);
    }

}
