// src/services/messageService.js

import apiClient from './apiClient'; // Usa la misma instancia de Axios

/**
 * Enviar un mensaje para un post específico.
 * @param {string} postId - El ID del post.
 * @returns {Promise<object>} Respuesta del servidor.
 */
export const sendMessage = async (postId) => {
  try {
    const response = await apiClient.post(`/post/${postId}`, { postId });
    return response.data;
  } catch (error) {
    console.error("Error al enviar el mensaje:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ocurrió un error al enviar el mensaje.');
  }
};
