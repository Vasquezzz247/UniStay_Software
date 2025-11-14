package com.dog.dto.request.User;

import com.dog.dto.response.RoleResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserRequest {

    @NotNull(message = "First name is required")
    private String firstName;

    @NotNull(message = "Last name is required")
    private String lastName;

    @NotNull(message = "Email is required")
    @Email(message = "Email should be valid with @")
    private String email;

    @NotNull(message = "Role is required")
    private String role;
}
