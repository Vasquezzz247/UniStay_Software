package com.dog.controller;

import com.dog.dto.request.Post.PostFilterRequest;
import com.dog.dto.response.GeneralResponse;
import com.dog.dto.response.PostResponse;
import com.dog.service.PostFilterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/post-filters")
public class PostFilterController {

    private final PostFilterService postFilterService;

    public PostFilterController(PostFilterService postFilterService) {
        this.postFilterService = postFilterService;
    }

    /**
     * Endpoint público para filtrar posts por:
     *  - rango de precios (minPrice, maxPrice)
     *  - distancia máxima a la UCA (maxDistanceKm)
     *
     * Todos los parámetros son opcionales.
     *
     * Ejemplo:
     *   GET /api/post-filters?minPrice=150&maxPrice=250&maxDistanceKm=5
     */
    @GetMapping
    public ResponseEntity<GeneralResponse> filterPosts(
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double maxDistanceKm
    ) {
        PostFilterRequest request = new PostFilterRequest();
        request.setMinPrice(minPrice);
        request.setMaxPrice(maxPrice);
        request.setMaxDistanceKm(maxDistanceKm);

        List<PostResponse> results = postFilterService.filterPosts(request);

        String message = "Posts filtrados encontrados: " + results.size();
        return buildResponse(message, HttpStatus.OK, results);
    }

    private ResponseEntity<GeneralResponse> buildResponse(String message, HttpStatus status, Object data) {
        String uri = ServletUriComponentsBuilder.fromCurrentRequest().toUriString();
        return ResponseEntity.status(status).body(
                GeneralResponse.builder()
                        .message(message)
                        .status(status.value())
                        .data(data)
                        .uri(uri)
                        .build()
        );
    }
}
