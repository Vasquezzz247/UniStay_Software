// src/services/postFilterService.js
import apiClient from "./apiClient";

/**
 * Filtra posts por:
 *  - minPrice (opcional)
 *  - maxPrice (opcional)
 *  - maxDistanceKm (opcional)
 *
 * Ejemplo:
 * filterPosts({ minPrice: 150, maxPrice: 300, maxDistanceKm: 5 })
 */
export async function filterPosts({ minPrice, maxPrice, maxDistanceKm }) {
    const params = {};

    if (minPrice !== undefined && minPrice !== null) {
        params.minPrice = minPrice;
    }
    if (maxPrice !== undefined && maxPrice !== null) {
        params.maxPrice = maxPrice;
    }
    if (maxDistanceKm !== undefined && maxDistanceKm !== null) {
        params.maxDistanceKm = maxDistanceKm;
    }

    const { data } = await apiClient.get("/post-filters", { params });
    return data.data || [];
}