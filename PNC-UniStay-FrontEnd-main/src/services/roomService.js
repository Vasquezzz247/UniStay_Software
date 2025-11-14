// src/services/roomService.js
import apiClient from './apiClient'; // <-- Importamos nuestra instancia centralizada de Axios

/**
 * Crea una nueva habitación.
 * Axios se encarga de 'JSON.stringify' y de poner el 'Content-Type'.
 * @param {object} roomData - Los datos de la habitación a crear.
 */
export const createRoom = async (roomData) => {
  try {
    const response = await apiClient.post('/room/', roomData);
    return response.data;
  } catch (error) {
    console.error("Error al crear la habitación:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error de red al crear la habitación.');
  }
};

/**
 * Obtiene todas las habitaciones.
 */
export const getAllRooms = async () => {
  try {
    const response = await apiClient.get('/room');
    // Asumimos que tu backend devuelve { data: [...] }
    return response.data.data || [];
  } catch (error) {
    console.error("Error al obtener las habitaciones:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error de red al obtener las habitaciones.');
  }
};

/**
 * Obtiene una habitación por su ID.
 */
export const getRoomById = async (roomId) => {
  if (!roomId) throw new Error("El ID de la habitación es requerido.");
  try {
    const response = await apiClient.get(`/room/${roomId}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error al obtener la habitación ${roomId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al obtener la habitación ${roomId}.`);
  }
};

/**
 * Actualiza una habitación existente.
 */
export const updateRoom = async (roomId, roomData) => {
  if (!roomId) throw new Error("El ID de la habitación es requerido para la actualización.");
  try {
    const response = await apiClient.put(`/room/${roomId}`, roomData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar la habitación ${roomId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al actualizar la habitación ${roomId}.`);
  }
};

/**
 * Elimina una habitación específica por su ID.
 */
export const deleteRoom = async (roomId) => {
  if (!roomId) throw new Error("El ID de la habitación es requerido para eliminar.");
  try {
    const response = await apiClient.delete(`/room/${roomId}`);
    return response.data; // Devuelve la respuesta del backend, ej. { message: "Eliminado con éxito" }
  } catch (error) {
    console.error(`Error al eliminar la habitación ${roomId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || `Error de red al eliminar la habitación ${roomId}.`);
  }
  
};

export const getMyRooms = async () => {
  try {
    const response = await apiClient.get('/room/my-rooms');
    return response.data; // Asumo que devuelve directamente la lista
  } catch (error) {
    console.error("Error al obtener mis habitaciones:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Error al obtener tus habitaciones.');
  }
};