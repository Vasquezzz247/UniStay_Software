package com.dog.repository;

import com.dog.entities.PostFavorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostFavoriteRepository extends JpaRepository<PostFavorite, UUID> {

    boolean existsByUser_IdAndPost_Id(UUID userId, UUID postId);

    Optional<PostFavorite> findByUser_IdAndPost_Id(UUID userId, UUID postId);

    List<PostFavorite> findByUser_IdOrderByCreatedAtDesc(UUID userId);
}