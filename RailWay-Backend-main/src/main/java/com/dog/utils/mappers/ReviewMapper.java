package com.dog.utils.mappers;

import com.dog.dto.response.Review.ReviewResponse;
import com.dog.entities.Review;

public class ReviewMapper {

    public static ReviewResponse toDTO(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .studentName(review.getStudent().getName())
                .createdAt(review.getCreatedAt())
                .build();
    }
}