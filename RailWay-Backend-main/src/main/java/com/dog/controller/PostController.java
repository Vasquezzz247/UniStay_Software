package com.dog.controller;

import com.dog.dto.request.Post.PostCreateRequest;
import com.dog.dto.request.Post.PostUpdateRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.PostResponse;
import com.dog.service.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // --- ENDPOINT PÚBLICO PARA OBTENER TODOS LOS POSTS ---
    @GetMapping
    public ResponseEntity<GeneralResponse> getAllPosts() {
        List<PostResponse> posts = postService.findAll();
        return buildResponse("Posts found", HttpStatus.OK, posts);
    }

    // --- NUEVO ENDPOINT SEGURO PARA OBTENER MIS POSTS ---
    @GetMapping("/my-posts")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> getMyPosts(Authentication authentication) {
        String ownerEmail = authentication.getName();
        List<PostResponse> myPosts = postService.findPostsByCurrentUser(ownerEmail);
        return buildResponse("User's posts retrieved successfully", HttpStatus.OK, myPosts);
    }

    // --- ENDPOINT PÚBLICO PARA OBTENER UN POST POR ID ---
    @GetMapping("/{id}")
    public ResponseEntity<GeneralResponse> getPostById(@PathVariable UUID id) {
        PostResponse post = postService.findById(id);
        return buildResponse("Post found", HttpStatus.OK, post);
    }

    // --- ENDPOINTS DE ESCRITURA (CREATE, UPDATE, DELETE) ---
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> createPost(
            @Valid @RequestPart("postData") PostCreateRequest postRequestDto,
            @RequestPart(value = "images", required = false) MultipartFile[] images,
            Authentication authentication
    ) {
        String ownerEmail = authentication.getName();
        PostResponse createdPost = postService.createPostForAuthenticatedOwner(postRequestDto, images, ownerEmail);
        return buildResponse("Post created successfully", HttpStatus.CREATED, createdPost);
    }

    @PutMapping(value = "/{postId}", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> updatePost(
            @PathVariable UUID postId,
            @Valid @RequestPart("postData") PostUpdateRequest postUpdateRequest,
            @RequestPart(value = "newImages", required = false) MultipartFile[] newImages,
            Authentication authentication
    ) {
        postUpdateRequest.setPostId(postId);
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        PostResponse updatedPost = postService.update(postUpdateRequest, newImages, currentUser);
        return buildResponse("Post updated successfully", HttpStatus.OK, updatedPost);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PROPIETARIO') or hasRole('ADMIN')")
    public ResponseEntity<GeneralResponse> deletePost(
            @PathVariable UUID id,
            Authentication authentication
    ) {
        UserDetails currentUser = (UserDetails) authentication.getPrincipal();
        postService.delete(id, currentUser);
        return buildResponse("Post deleted successfully", HttpStatus.OK, null);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .build());
    }
}