// src/services/bookmarkService.js
import apiClient from './apiClient';

export async function addBookmark(postId) {
    await apiClient.post(`/bookmarks/${postId}`);
}

export async function removeBookmark(postId) {
    await apiClient.delete(`/bookmarks/${postId}`);
}

export async function getMyBookmarks() {
    const { data } = await apiClient.get('/bookmarks');
    // data.data trae la lista de PostResponse por tu GeneralResponse
    return data.data || [];
}