package com.dog.service.impl;

import com.dog.dto.request.Post.PostFilterRequest;
import com.dog.dto.response.PostResponse;
import com.dog.entities.Post;
import com.dog.entities.Room;
import com.dog.repository.PostRepository;
import com.dog.repository.ReviewRepository;
import com.dog.service.PostFilterService;
import com.dog.utils.GeoDistanceUtil;
import com.dog.utils.mappers.PostMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PostFilterServiceImpl implements PostFilterService {

    // Coordenadas fijas de la UCA (aprox.)
    private static final double UCA_LAT = 13.6824;
    private static final double UCA_LNG = -89.2360;

    private final PostRepository postRepository;
    private final ReviewRepository reviewRepository;

    public PostFilterServiceImpl(PostRepository postRepository,
                                 ReviewRepository reviewRepository) {
        this.postRepository = postRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> filterPosts(PostFilterRequest filterRequest) {

        Double minPrice = filterRequest.getMinPrice();
        Double maxPrice = filterRequest.getMaxPrice();
        Double maxDistanceKm = filterRequest.getMaxDistanceKm();

        // 1) Traemos todos los posts (como ya tenés pocos, esto está bien para el proyecto)
        List<Post> allPosts = postRepository.findAll();

        // 2) Filtramos en memoria según lo que venga en el request
        List<Post> filtered = allPosts.stream()
                .filter(post -> filterByPrice(post, minPrice, maxPrice))
                .filter(post -> filterByDistance(post, maxDistanceKm))
                .collect(Collectors.toList());

        // 3) Mapeamos a DTO
        List<PostResponse> responses = filtered.stream()
                .map(PostMapper::toDTO)
                .collect(Collectors.toList());

        // 4) Enriquecer con rating (igual que en PostServiceImpl)
        enrichPostsWithRating(responses);

        return responses;
    }

    // ---------- Helpers ----------

    private boolean filterByPrice(Post post, Double minPrice, Double maxPrice) {
        double price = post.getPrice();

        if (minPrice != null && price < minPrice) {
            return false;
        }
        if (maxPrice != null && price > maxPrice) {
            return false;
        }
        return true;
    }

    private boolean filterByDistance(Post post, Double maxDistanceKm) {
        if (maxDistanceKm == null) {
            // No se está filtrando por distancia
            return true;
        }

        Room room = post.getRoom();
        if (room == null || room.getLat() == null || room.getLng() == null) {
            // Si no hay coordenadas, por seguridad lo excluimos del filtro por distancia
            return false;
        }

        try {
            double distance = GeoDistanceUtil.distanceInKm(
                    UCA_LAT,
                    UCA_LNG,
                    room.getLat(),
                    room.getLng()
            );

            System.out.println("[DEBUG distance] postId=" + post.getId()
                    + " roomLat=" + room.getLat()
                    + " roomLng=" + room.getLng()
                    + " maxDistanceKm=" + maxDistanceKm
                    + " distance=" + distance);

            return distance <= maxDistanceKm;
        } catch (Exception e) {
            // Si de verdad algo raro pasa, que no te tumbe el endpoint
            e.printStackTrace();
            // Por ahora lo excluimos del resultado para no romper nada
            return false;
        }
    }

    private void enrichPostsWithRating(List<PostResponse> responses) {
        if (responses == null) return;

        responses.forEach(this::enrichPostWithRating);
    }

    private void enrichPostWithRating(PostResponse response) {
        if (response == null || response.getPostId() == null) return;

        UUID postId = response.getPostId();

        Double avg = reviewRepository.findAverageRatingByPostId(postId);
        long count = reviewRepository.countByPost_Id(postId);

        response.setAverageRating(avg != null ? avg : 0.0);
        response.setTotalReviews(count);
    }
}