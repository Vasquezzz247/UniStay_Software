// src/main/java/com/dog/utils/mappers/PostMapper.java

package com.dog.utils.mappers;

import com.dog.dto.request.Post.PostCreateRequest;
import com.dog.dto.request.Post.PostUpdateRequest;
import com.dog.dto.response.PostResponse;
import com.dog.entities.Post;
import com.dog.entities.PostImage;
import com.dog.entities.Room;
import com.dog.entities.User;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class to map between Post entities and DTOs.
 */
public class PostMapper {

    /**
     * Converts a Post entity to a PostResponse DTO.
     * @param post The Post entity to convert.
     * @return The corresponding PostResponse DTO.
     */
    public static PostResponse toDTO(Post post) {
        if (post == null) {
            return null;
        }

        List<String> imageUrls = (post.getImages() != null && !post.getImages().isEmpty()) ?
                post.getImages().stream()
                        .sorted(Comparator.comparingInt(PostImage::getDisplayOrder))
                        .map(PostImage::getImageUrl)
                        .collect(Collectors.toList()) :
                Collections.emptyList();

        return PostResponse.builder()
                .postId(post.getId())
                .title(post.getTitle())
                .price(post.getPrice())
                .imageUrls(imageUrls)
                .status(post.getStatus())
                .owner(post.getOwner() != null ? post.getOwner().getName() + " " + post.getOwner().getLastName() : "N/A")
                .roomDetails(post.getRoom() != null ? RoomMapper.toDTO(post.getRoom()) : null)
                .minimumLeaseTerm(post.getMinimumLeaseTerm())
                .maximumLeaseTerm(post.getMaximumLeaseTerm())
                .securityDeposit(post.getSecurityDeposit())
                .build();
    }

    /**
     * Converts a list of Post entities to a list of PostResponse DTOs.
     * @param posts The list of Post entities.
     * @return A list of PostResponse DTOs.
     */
    public static List<PostResponse> toDTOList(List<Post> posts) {
        if (posts == null || posts.isEmpty()) {
            return Collections.emptyList();
        }
        return posts.stream()
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Creates a new Post entity from a PostCreateRequest DTO.
     * This is the corrected method for the new secure creation flow.
     * @param dto The PostCreateRequest DTO.
     * @param owner The authenticated User entity (owner).
     * @param room The Room entity associated with the post.
     * @return A new Post entity.
     */
    public static Post toEntityCreate(PostCreateRequest dto, User owner, Room room) {
        if (dto == null) {
            return null;
        }
        return Post.builder()
                .title(dto.getTitle())
                .price(dto.getPrice().doubleValue())
                .status(dto.getStatus())
                .owner(owner)
                .room(room)
                .images(new ArrayList<>())
                .minimumLeaseTerm(dto.getMinimumLeaseTerm())
                .maximumLeaseTerm(dto.getMaximumLeaseTerm())
                .securityDeposit(dto.getSecurityDeposit().doubleValue()) // <-- CORRECCIÓN AQUÍ
                .build();
    }

    /**
     * Updates an existing Post entity from a PostUpdateRequest DTO.
     * @param dto The PostUpdateRequest DTO with new data.
     * @param existingPost The Post entity to be updated.
     * @param owner The User entity (owner).
     * @param room The Room entity.
     */
    public static void updateEntityFromDto(PostUpdateRequest dto, Post existingPost, User owner, Room room) {
        if (dto == null || existingPost == null) {
            return;
        }

        if (dto.getTitle() != null) existingPost.setTitle(dto.getTitle());
        if (dto.getPrice() != null) existingPost.setPrice(dto.getPrice().doubleValue());
        if (dto.getStatus() != null) existingPost.setStatus(dto.getStatus());
        if (owner != null) existingPost.setOwner(owner);
        if (room != null) existingPost.setRoom(room);
        if (dto.getMinimumLeaseTerm() != null) existingPost.setMinimumLeaseTerm(dto.getMinimumLeaseTerm());
        if (dto.getMaximumLeaseTerm() != null) existingPost.setMaximumLeaseTerm(dto.getMaximumLeaseTerm());
        if (dto.getSecurityDeposit() != null) existingPost.setSecurityDeposit(dto.getSecurityDeposit().doubleValue()); // <-- CORRECCIÓN AQUÍ
    }
}
