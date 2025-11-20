package com.dog.dto.request.Post;

import lombok.Data;

@Data
public class PostFilterRequest {

    // Rango de precios (pueden venir en null)
    private Double minPrice;
    private Double maxPrice;

    // Distancia máxima en km desde la UCA (puede venir en null)
    private Double maxDistanceKm;
}
