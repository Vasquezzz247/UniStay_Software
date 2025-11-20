package com.dog.repository;

import com.dog.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    List<Review> findByPost_Id(UUID postId);

    Optional<Review> findByPost_IdAndStudent_Id(UUID postId, UUID studentId);

    long countByPost_Id(UUID postId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.post.id = :postId")
    Double findAverageRatingByPostId(UUID postId);
}