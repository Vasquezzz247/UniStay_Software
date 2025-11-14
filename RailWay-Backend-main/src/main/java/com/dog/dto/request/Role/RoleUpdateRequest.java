package com.dog.dto.request.Role;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class RoleUpdateRequest {

    @NotNull(message = "You must provide an role ID")
    private UUID roleId;
    private String roleName;

}
