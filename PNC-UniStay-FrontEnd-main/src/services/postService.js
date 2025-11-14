// src/services/postService.js
import apiClient from './apiClient'; // <-- Importamos nuestra instancia centralizada

export const getAllPosts = async () => {
  try {
    // axios automáticamente parsea el JSON y lanza un error si el status no es 2xx
    const response = await apiClient.get('/post');
    // Asumimos que tu backend devuelve { data: [...] }
    return response.data.data || []; 
  } catch (error) {
    console.error("Error al obtener publicaciones:", error.response?.data || error.message);
    // Lanzamos un error más limpio para que el componente lo maneje
    throw new Error(error.response?.data?.message || 'Error de red al obtener publicaciones.');
  }
};

export const getMyPosts = async () => {
  try {
    const response = await apiClient.get('/post/my-posts');
    return response.data;
  } catch (error) {
    // --- LÓGICA DE ERROR MEJORADA ---
    // Si el error tiene una respuesta del servidor (ej: 401, 403, 404, 500),
    // lanzamos los datos de esa respuesta.
    if (error.response) {
      throw error.response.data;
    } 
    // Si no hay respuesta (error de red, CORS, etc.),
    // lanzamos un objeto de error genérico con una estructura consistente.
    else {
      throw { 
        message: error.message || 'No se pudo conectar al servidor. Revisa tu conexión de red.',
        status: 503 // Service Unavailable
      };
    }
  }
};

export const getPostById = async (postId) => {
  if (!postId) throw new Error("El ID del post es requerido.");
  try {
    const response = await apiClient.get(`/post/${postId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener la publicación ${postId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al obtener la publicación ${postId}.`);
  }
};

/**
 * Crea una nueva publicación (Post) enviando FormData.
 * Axios se encarga de poner el Content-Type 'multipart/form-data' automáticamente.
 */
export const createPost = async (formDataPayload) => {
  try {
    const response = await apiClient.post('/post/', formDataPayload);
    return response.data;
  } catch (error) {
    console.error("Error al crear la publicación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error de red al crear la publicación.');
  }
};

/**
 * Actualiza una publicación existente.
 */
export const updatePost = async (postId, formDataPayload) => {
  if (!postId) throw new Error("El ID del post es requerido para la actualización.");
  try {
    // Usamos 'put' para actualizar. Axios maneja FormData aquí también.
    const response = await apiClient.put(`/post/${postId}`, formDataPayload);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la publicación ${postId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al actualizar la publicación ${postId}.`);
  }
};

/**
 * Elimina una publicación específica por su ID.
 */
export const deletePost = async (postId) => {
  if (!postId) throw new Error("El ID del post es requerido para eliminar.");
  try {
    const response = await apiClient.delete(`/post/${postId}`);
    // Un DELETE exitoso puede devolver 200 OK con un mensaje o 204 No Content.
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar la publicación ${postId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al eliminar la publicación ${postId}.`);
  }
};