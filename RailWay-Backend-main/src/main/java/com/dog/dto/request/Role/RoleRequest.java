package com.dog.dto.request.Role;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RoleRequest {
    @NotNull(message = "Role name cannot be null")
    @NotBlank(message = "Role name cannot be empty")
    private String roleName;

}
