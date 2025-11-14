package com.dog.dto.response;

import com.dog.entities.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserResponse {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> roles;
}
