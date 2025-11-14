// src/main/java/com/dog/service/PostService.java

package com.dog.service;

import com.dog.dto.request.Post.PostCreateRequest;
import com.dog.dto.request.Post.PostUpdateRequest;
import com.dog.dto.response.PostResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface PostService {

    List<PostResponse> findAll();
    PostResponse findById(UUID id);
    List<PostResponse> findPostsByOwnerId(UUID ownerId);
    PostResponse createPostForAuthenticatedOwner(PostCreateRequest postRequest, MultipartFile[] images, String ownerEmail);
    PostResponse update(PostUpdateRequest postUpdateRequest, MultipartFile[] newImages, UserDetails currentUser);
    void delete(UUID id, UserDetails currentUser);
    List<PostResponse> findPostsByCurrentUser(String email);
}
