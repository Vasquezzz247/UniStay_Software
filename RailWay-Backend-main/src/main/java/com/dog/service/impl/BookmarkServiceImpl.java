package com.dog.service.impl;

import com.dog.dto.response.PostResponse;
import com.dog.entities.Post;
import com.dog.entities.PostFavorite;
import com.dog.entities.User;
import com.dog.exception.ResourceNotFoundException;
import com.dog.repository.PostFavoriteRepository;
import com.dog.repository.PostRepository;
import com.dog.repository.UserRepository;
import com.dog.service.BookmarkService;
import com.dog.utils.mappers.PostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkServiceImpl implements BookmarkService {

    private final PostFavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    @Override
    @Transactional
    public void addBookmark(UUID postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", userEmail));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post", "id", postId));

        // Idempotente: si ya existe, no hacemos nada
        if (favoriteRepository.existsByUser_IdAndPost_Id(user.getId(), postId)) {
            return;
        }

        PostFavorite favorite = PostFavorite.builder()
                .user(user)
                .post(post)
                .build();

        favoriteRepository.save(favorite);
    }

    @Override
    @Transactional
    public void removeBookmark(UUID postId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", userEmail));

        favoriteRepository.findByUser_IdAndPost_Id(user.getId(), postId)
                .ifPresent(favoriteRepository::delete);
        // Si no existe, silenciosamente no hacemos nada (también idempotente)
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getMyBookmarks(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", userEmail));

        return favoriteRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(PostFavorite::getPost)
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());
    }
}