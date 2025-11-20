package com.dog.controller;

import com.dog.dto.request.Review.ReviewCreateRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.Review.ReviewResponse;
import com.dog.dto.response.Review.ReviewSummaryResponse;
import com.dog.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/{postId}/reviews")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<GeneralResponse> createOrUpdateReview(
            @PathVariable UUID postId,
            @Valid @RequestBody ReviewCreateRequest request,
            @AuthenticationPrincipal UserDetails currentUser
    ) {
        ReviewResponse review = reviewService.createOrUpdateReview(postId, request, currentUser.getUsername());
        return buildResponse("Review creada/actualizada correctamente", HttpStatus.OK, review);
    }

    @GetMapping("/{postId}/reviews")
    public ResponseEntity<GeneralResponse> getReviewsForPost(@PathVariable UUID postId) {
        List<ReviewResponse> reviews = reviewService.getReviewsForPost(postId);
        return buildResponse("Reviews encontradas", HttpStatus.OK, reviews);
    }

    @GetMapping("/{postId}/reviews/summary")
    public ResponseEntity<GeneralResponse> getSummaryForPost(@PathVariable UUID postId) {
        ReviewSummaryResponse summary = reviewService.getSummaryForPost(postId);
        return buildResponse("Resumen de calificaciones obtenido", HttpStatus.OK, summary);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
        return ResponseEntity.status(status).body(GeneralResponse.builder()
                .message(message)
                .status(status.value())
                .data(data)
                .uri(uri)
                .build());
    }
}