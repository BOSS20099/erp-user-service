package com.erp.userservice.controller;

import com.erp.userservice.dto.AssignRolesDTO;
import com.erp.userservice.dto.UserDTO;
import com.erp.userservice.model.Role;
import com.erp.userservice.model.User;
import com.erp.userservice.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> listUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PostMapping
    public User createUser(@RequestBody UserDTO dto) {
        return userService.createUser(dto);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody UserDTO dto) {
        return userService.updateUser(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @GetMapping("/{id}/roles")
    public List<Role> getUserRoles(@PathVariable Long id) {
        return userService.getUserRoles(id);
    }

    @PostMapping("/{id}/roles")
    public void assignRolesToUser(@PathVariable Long id, @RequestBody AssignRolesDTO dto) {
        userService.assignRolesToUser(id, dto.getRoleIds());
    }

}
