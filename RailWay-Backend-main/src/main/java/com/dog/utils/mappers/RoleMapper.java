package com.dog.utils.mappers;

import com.dog.dto.request.Role.RoleRequest;
import com.dog.dto.request.Role.RoleUpdateRequest;
import com.dog.dto.response.RoleResponse;
import com.dog.entities.Role;

import java.util.List;

public class RoleMapper {

    public static Role toEntity(RoleResponse roleResponse) {
        return Role.builder()
                .id(roleResponse.getRoleId())
                .role(roleResponse.getRoleName())
                .build();
    }

    public static Role toEntityCreate(RoleRequest roleDTO) {
        return Role.builder()
                .role(roleDTO.getRoleName())
                .build();
    }

    public static Role toEntityUpdate(RoleUpdateRequest roleDTO) {
        return Role.builder()
                .id(roleDTO.getRoleId())
                .role(roleDTO.getRoleName())
                .build();
    }

    public static RoleResponse toDTO(Role role){
        return RoleResponse.builder()
                .roleId(role.getId())
                .roleName(role.getRole())
                .build();
    }

    public static List<RoleResponse> toDTOList(List<Role> roles) {
        return roles.stream()
                .map(RoleMapper::toDTO)
                .toList();
    }

    public static Role toEntity(RoleRequest request) {
        if (request == null) {
            return null;
        }
        return Role.builder()
                .role(request.getRoleName())
                .build();
    }


}
