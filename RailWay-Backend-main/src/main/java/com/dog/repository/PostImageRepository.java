package com.dog.repository;

import com.dog.entities.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface PostImageRepository extends JpaRepository<PostImage, Long> {
}