package com.dog.dto.request.Post;

import com.dog.dto.request.User.UserUpdateRequest;
import com.dog.dto.response.RoomResponse;
import com.dog.dto.response.UserResponse;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
@Builder
public class PostUpdateRequest {

    @NotNull(message = "You must provide a post ID")
    private UUID postId;
    private String title;
    private Double price;
    private String image;
    private String status;
    private String owner;
    private String room;
    private String minimumLeaseTerm;
    private String maximumLeaseTerm;
    private Double securityDeposit;

    private List<String> imagesToDelete;

}
