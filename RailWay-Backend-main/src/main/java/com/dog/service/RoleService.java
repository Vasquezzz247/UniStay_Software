package com.dog.service;

import com.dog.dto.request.Role.RoleRequest;
import com.dog.dto.request.Role.RoleUpdateRequest;
import com.dog.dto.response.RoleResponse;

import java.util.List;
import java.util.UUID;

public interface RoleService {
    List<RoleResponse> findAll();
    RoleResponse findById(UUID UUID);
    RoleResponse save(RoleRequest role);
    RoleResponse update(RoleUpdateRequest role);
    void delete(UUID UUID);
}
