package com.dog.service.impl;

import com.dog.dto.request.Review.ReviewCreateRequest;
import com.dog.dto.response.Review.ReviewResponse;
import com.dog.dto.response.Review.ReviewSummaryResponse;
import com.dog.entities.InterestRequest;
import com.dog.entities.Post;
import com.dog.entities.Review;
import com.dog.entities.User;
import com.dog.exception.ResourceNotFoundException;
import com.dog.exception.UnauthorizedOperationException;
import com.dog.repository.InterestRequestRepository;
import com.dog.repository.PostRepository;
import com.dog.repository.ReviewRepository;
import com.dog.repository.UserRepository;
import com.dog.service.ReviewService;
import com.dog.utils.mappers.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final InterestRequestRepository interestRequestRepository;

    @Override
    @Transactional
    public ReviewResponse createOrUpdateReview(UUID postId, ReviewCreateRequest request, String studentEmail) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Publicación", "id", postId));

        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", "email", studentEmail));

        // ✅ Regla: solo quien ha SOLICITADO esa publicación puede reseñar
        InterestRequest interest = interestRequestRepository
                .findByPost_IdAndStudent_Id(post.getId(), student.getId())
                .orElseThrow(() -> new UnauthorizedOperationException(
                        "Solo los estudiantes que han solicitado esta habitación pueden dejar una reseña.")
                );

        // No usamos el estado por ahora, con el simple hecho de haberla solicitado basta
        // (si quieres restringir a ACCEPTED, lo cambiamos fácil aquí).

        Review review = reviewRepository.findByPost_IdAndStudent_Id(post.getId(), student.getId())
                .orElse(Review.builder()
                        .post(post)
                        .student(student)
                        .createdAt(LocalDateTime.now())
                        .build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUpdatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        return ReviewMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForPost(UUID postId) {
        return reviewRepository.findByPost_Id(postId).stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ReviewSummaryResponse getSummaryForPost(UUID postId) {
        long total = reviewRepository.countByPost_Id(postId);
        Double avg = reviewRepository.findAverageRatingByPostId(postId);

        return ReviewSummaryResponse.builder()
                .totalReviews(total)
                .averageRating(avg != null ? avg : 0.0)
                .build();
    }
}
