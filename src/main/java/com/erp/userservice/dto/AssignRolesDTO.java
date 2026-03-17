package com.erp.userservice.dto;

public class AssignRolesDTO {
    private Long[] roleIds;

    public AssignRolesDTO() {}

    public AssignRolesDTO(Long[] roleIds) {
        this.roleIds = roleIds;
    }

    public Long[] getRoleIds() {
        return roleIds;
    }

    public void setRoleIds(Long[] roleIds) {
        this.roleIds = roleIds;
    }
}
