package com.dog.service.impl;

import com.dog.dto.request.Post.PostCreateRequest;
import com.dog.dto.request.Post.PostUpdateRequest;
import com.dog.dto.response.PostResponse;
import com.dog.entities.Post;
import com.dog.entities.PostImage;
import com.dog.entities.Room;
import com.dog.entities.User;
import com.dog.exception.PostNotFoundException;
import com.dog.exception.ResourceNotFoundException;
import com.dog.exception.RoomInUseException;
import com.dog.exception.UnauthorizedOperationException;
import com.dog.repository.PostRepository;
import com.dog.repository.RoomRepository;
import com.dog.repository.UserRepository;
import com.dog.repository.ReviewRepository;
import com.dog.service.FileStorageService;
import com.dog.service.PostService;
import com.dog.utils.mappers.PostMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final FileStorageService fileStorageService;
    private final ReviewRepository reviewRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository,
                           UserRepository userRepository,
                           RoomRepository roomRepository,
                           FileStorageService fileStorageService,
                           ReviewRepository reviewRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.fileStorageService = fileStorageService;
        this.reviewRepository = reviewRepository;
    }

    // ==================== Helpers para rating ====================

    private void enrichPostWithRating(PostResponse response) {
        if (response == null || response.getPostId() == null) return;

        Double avg = reviewRepository.findAverageRatingByPostId(response.getPostId());
        long count = reviewRepository.countByPost_Id(response.getPostId());

        response.setAverageRating(avg != null ? avg : 0.0);
        response.setTotalReviews(count);
    }

    private void enrichPostsWithRating(List<PostResponse> responses) {
        if (responses == null) return;
        responses.forEach(this::enrichPostWithRating);
    }

    // ==================== Implementación de PostService ====================

    @Override
    @Transactional
    public PostResponse createPostForAuthenticatedOwner(PostCreateRequest postRequest,
                                                        MultipartFile[] images,
                                                        String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User (Owner)", "email", ownerEmail));
        Room room = roomRepository.findById(postRequest.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room", "ID", postRequest.getRoomId()));

        if (!room.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedOperationException("No tienes permiso para crear un post para una habitación que no te pertenece.");
        }

        if (postRepository.countByRoomId(postRequest.getRoomId()) > 0) {
            throw new RoomInUseException("La habitación con ID " + postRequest.getRoomId() + " ya está asociada a otra publicación.");
        }

        Post newPost = PostMapper.toEntityCreate(postRequest, owner, room);
        Post tempSavedPost = postRepository.save(newPost);

        if (images != null && images.length > 0) {
            List<PostImage> postImagesCollection = new ArrayList<>();
            int displayOrder = 0;
            for (MultipartFile imageFile : images) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        String subfolder = "posts/" + tempSavedPost.getId().toString();
                        String imageUrl = fileStorageService.storeFile(imageFile, subfolder);
                        postImagesCollection.add(PostImage.builder()
                                .imageUrl(imageUrl)
                                .post(tempSavedPost)
                                .displayOrder(displayOrder++)
                                .build());
                    } catch (IOException e) {
                        throw new RuntimeException("Fallo al guardar la imagen: " + imageFile.getOriginalFilename(), e);
                    }
                }
            }
            tempSavedPost.setImages(postImagesCollection);
        }

        Post finalSavedPost = postRepository.save(tempSavedPost);
        PostResponse response = PostMapper.toDTO(finalSavedPost);
        enrichPostWithRating(response);
        return response;
    }

    @Override
    @Transactional
    public PostResponse update(PostUpdateRequest postUpdateRequest,
                               MultipartFile[] newImages,
                               UserDetails currentUser) {
        Post existingPost = postRepository.findById(postUpdateRequest.getPostId())
                .orElseThrow(() -> new PostNotFoundException("Post no encontrado para actualizar con ID: " + postUpdateRequest.getPostId()));
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        if (!existingPost.getOwner().getEmail().equals(currentUser.getUsername()) && !isAdmin) {
            throw new UnauthorizedOperationException("No tienes permiso para editar este post.");
        }

        existingPost.setTitle(postUpdateRequest.getTitle());
        existingPost.setPrice(postUpdateRequest.getPrice());
        existingPost.setStatus(postUpdateRequest.getStatus());
        existingPost.setMinimumLeaseTerm(postUpdateRequest.getMinimumLeaseTerm());
        existingPost.setMaximumLeaseTerm(postUpdateRequest.getMaximumLeaseTerm());
        existingPost.setSecurityDeposit(postUpdateRequest.getSecurityDeposit());

        if (postUpdateRequest.getImagesToDelete() != null && !postUpdateRequest.getImagesToDelete().isEmpty()) {
            List<PostImage> imagesToRemove = new ArrayList<>();
            for (String urlToDelete : postUpdateRequest.getImagesToDelete()) {
                existingPost.getImages().stream()
                        .filter(img -> img.getImageUrl().equals(urlToDelete))
                        .findFirst()
                        .ifPresent(imagesToRemove::add);
            }
            imagesToRemove.forEach(image -> {
                try {
                    existingPost.getImages().remove(image);
                    fileStorageService.deleteFile(image.getImageUrl());
                } catch (IOException e) {
                    System.err.println("Error al eliminar el archivo físico de la imagen: " + image.getImageUrl());
                }
            });
        }

        if (newImages != null && newImages.length > 0) {
            if (existingPost.getImages() == null) {
                existingPost.setImages(new ArrayList<>());
            }
            int displayOrder = existingPost.getImages().size();
            for (MultipartFile imageFile : newImages) {
                if (imageFile != null && !imageFile.isEmpty()) {
                    try {
                        String subfolder = "posts/" + existingPost.getId().toString();
                        String imageUrl = fileStorageService.storeFile(imageFile, subfolder);
                        existingPost.getImages().add(PostImage.builder()
                                .imageUrl(imageUrl)
                                .post(existingPost)
                                .displayOrder(displayOrder++)
                                .build());
                    } catch (IOException e) {
                        throw new RuntimeException("Fallo al guardar la nueva imagen: " + imageFile.getOriginalFilename(), e);
                    }
                }
            }
        }

        Post updatedPost = postRepository.save(existingPost);
        PostResponse response = PostMapper.toDTO(updatedPost);
        enrichPostWithRating(response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> findAll() {
        List<PostResponse> responses = postRepository.findAll().stream()
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());
        enrichPostsWithRating(responses);
        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse findById(UUID id) {
        PostResponse response = postRepository.findById(id)
                .map(PostMapper::toDTO)
                .orElseThrow(() -> new PostNotFoundException("Post no encontrado con ID: " + id));
        enrichPostWithRating(response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> findPostsByCurrentUser(String email) {
        User owner = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", email));

        List<Post> userPosts = postRepository.findByOwnerId(owner.getId());
        List<PostResponse> responses = userPosts.stream()
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());
        enrichPostsWithRating(responses);
        return responses;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> findPostsByOwnerId(UUID ownerId) {
        userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User (Owner)", "ID", ownerId));

        List<PostResponse> responses = postRepository.findByOwnerId(ownerId).stream()
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());
        enrichPostsWithRating(responses);
        return responses;
    }

    @Override
    @Transactional
    public void delete(UUID id, UserDetails currentUser) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new PostNotFoundException("Post no encontrado para eliminar."));
        boolean isAdmin = currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        if (!post.getOwner().getEmail().equals(currentUser.getUsername()) && !isAdmin) {
            throw new UnauthorizedOperationException("No tienes permiso para eliminar este post.");
        }
        if (post.getImages() != null) {
            for (PostImage image : new ArrayList<>(post.getImages())) {
                try {
                    fileStorageService.deleteFile(image.getImageUrl());
                } catch (IOException e) {
                    System.err.println("Error al eliminar archivo físico " + image.getImageUrl() + ": " + e.getMessage());
                }
            }
        }
        postRepository.delete(post);
    }
}
