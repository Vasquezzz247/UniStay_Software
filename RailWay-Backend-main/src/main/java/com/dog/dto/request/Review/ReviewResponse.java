package com.dog.dto.response.Review;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class ReviewResponse {

    private UUID id;
    private int rating;
    private String comment;
    private String studentName;
    private LocalDateTime createdAt;
}