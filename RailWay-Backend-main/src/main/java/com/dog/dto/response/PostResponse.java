package com.dog.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PostResponse {
    private UUID postId;
    private String title;
    private double price;
    private List<String> imageUrls;
    private String status;
    private String owner;
    private RoomResponse roomDetails;

    private String minimumLeaseTerm;
    private String maximumLeaseTerm;
    private Double securityDeposit;

    private Double averageRating;
    private Long totalReviews;
}