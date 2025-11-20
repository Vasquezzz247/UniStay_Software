package com.dog.dto.response.Review;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewSummaryResponse {

    private double averageRating;
    private long totalReviews;
}
