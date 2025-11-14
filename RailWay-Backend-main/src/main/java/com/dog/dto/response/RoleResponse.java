package com.dog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RoleResponse {
    private UUID roleId;
    private String roleName;

}
