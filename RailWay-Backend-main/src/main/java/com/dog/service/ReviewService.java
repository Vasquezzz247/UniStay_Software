package com.dog.service;

import com.dog.dto.request.Review.ReviewCreateRequest;
import com.dog.dto.response.Review.ReviewResponse;
import com.dog.dto.response.Review.ReviewSummaryResponse;

import java.util.List;
import java.util.UUID;

public interface ReviewService {

    ReviewResponse createOrUpdateReview(UUID postId, ReviewCreateRequest request, String studentEmail);

    List<ReviewResponse> getReviewsForPost(UUID postId);

    ReviewSummaryResponse getSummaryForPost(UUID postId);
}