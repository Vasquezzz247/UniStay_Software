package com.dog.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.UUID;

@Data
@Builder
public class PostImageResponse {
    private UUID id;
    private String imageUrl;
    private int displayOrder;
}