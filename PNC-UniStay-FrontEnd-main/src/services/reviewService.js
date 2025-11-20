// src/services/reviewService.js
import apiClient from './apiClient';

/**
 * Crea una nueva reseña para un post.
 * body esperado por el backend:
 * { postId: UUID, rating: number(1-5), comment?: string }
 */
export async function createReview({ postId, rating, comment }) {
    const payload = { postId, rating, comment };
    const { data } = await apiClient.post(`/posts/${postId}/reviews`, payload);
    return data.data;
}

/**
 * Obtiene todas las reseñas de un post específico.
 * Backend: GET /api/posts/{postId}/reviews
 */
export async function getReviewsForPost(postId) {
    const { data } = await apiClient.get(`/posts/${postId}/reviews`);
    return data.data || [];
}

export async function getMyReviews() {
    const { data } = await apiClient.get('/reviews/mine');
    return data.data || [];
}

export async function updateReview(reviewId, { rating, comment }) {
    const payload = { rating, comment };
    const { data } = await apiClient.put(`/reviews/${reviewId}`, payload);
    return data.data;
}

export async function deleteReview(reviewId) {
    const { data } = await apiClient.delete(`/reviews/${reviewId}`);
    return data.data ?? null;
}