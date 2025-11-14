package com.dog.controller;

import com.dog.dto.request.User.UserRequest;
import com.dog.dto.request.User.UserUpdateRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.PostResponse;
import com.dog.dto.response.UserResponse;
import com.dog.exception.UserNotFoundException;
import com.dog.service.PostService;
import com.dog.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/user") // El path base es /api/user
public class UserController {

    private final UserService userService;
    private final PostService postService; // Inyecta PostService

    @Autowired
    public UserController(UserService userService, PostService postService) { // Modifica el constructor
        this.userService = userService;
        this.postService = postService;
    }

    @GetMapping()
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getUsers() {
        List<UserResponse> users = userService.findAll();
        if (users.isEmpty()) {
            throw new UserNotFoundException("Users were not found");
        }
        return buildResponse("Users found", HttpStatus.OK, users);
    }

    @GetMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getUserById(@PathVariable UUID id) {
        UserResponse user = userService.findById(id);
        return buildResponse("User found", HttpStatus.OK, user);
    }


    @GetMapping("/{userId}/post")
    //@PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getPostsByUserId(@PathVariable UUID userId) {
        List<PostResponse> posts = postService.findPostsByOwnerId(userId);
        if (posts.isEmpty()){
            return buildResponse("No posts found for this user", HttpStatus.OK, posts);
        }
        return buildResponse("Posts by user found", HttpStatus.OK, posts);
    }


    @PostMapping("/")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> createUser(@Valid @RequestBody UserRequest user) {
        UserResponse createdUser = userService.save(user);
        return buildResponse("User created", HttpStatus.CREATED, createdUser);
    }

    @PutMapping("/")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> updateUser(@Valid @RequestBody UserUpdateRequest user) {
        UserResponse updatedUser = userService.update(user);
        return buildResponse("User updated", HttpStatus.OK, updatedUser);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> deleteUser(@PathVariable UUID id) {
        userService.delete(id);
        return buildResponse("User deleted", HttpStatus.OK, null);
    }

    public ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequestUri().toUriString(); // .build().getPath() puede ser demasiado corto.
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .build());
    }
}
