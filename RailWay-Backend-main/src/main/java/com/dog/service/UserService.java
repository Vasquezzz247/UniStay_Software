package com.dog.service;

import com.dog.dto.request.User.RegisterRequest;
import com.dog.dto.request.User.UserRequest;
import com.dog.dto.request.User.UserUpdateRequest;
import com.dog.dto.response.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {
    List<UserResponse> findAll();
    UserResponse findById(UUID UUID);
    UserResponse save(UserRequest User);
    UserResponse update(UserUpdateRequest User);
    void delete(UUID UUID);

    UserResponse registerUser(RegisterRequest registerRequest);
}
