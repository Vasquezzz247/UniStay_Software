// src/main/java/com/dog/utils/mappers/UserMapper.java

package com.dog.utils.mappers;

import com.dog.dto.response.UserResponse;
import com.dog.entities.Role;
import com.dog.entities.User;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserResponse toDTO(User user) {
        if (user == null) {
            return null;
        }

        List<String> roleNames = user.getRoles() != null ?
                user.getRoles().stream()
                        .map(Role::getRole) // Obtiene el String del nombre del rol
                        .collect(Collectors.toList()) :
                Collections.emptyList();

        // Asume que tu UserResponse tiene un campo 'roles' de tipo List<String>
        return UserResponse.builder()
                .userId(user.getId())
                .firstName(user.getName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .roles(roleNames)
                .build();
    }

    public static List<UserResponse> toDTOList(List<User> users) {
        if (users == null || users.isEmpty()) {
            return Collections.emptyList();
        }
        return users.stream()
                .map(UserMapper::toDTO)
                .collect(Collectors.toList());
    }

}
