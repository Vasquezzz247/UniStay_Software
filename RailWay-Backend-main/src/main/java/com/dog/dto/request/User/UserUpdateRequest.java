package com.dog.dto.request.User;

import com.dog.dto.response.RoleResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserUpdateRequest {
    @NotNull(message = "You must provide a user ID")
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private String role;
}
