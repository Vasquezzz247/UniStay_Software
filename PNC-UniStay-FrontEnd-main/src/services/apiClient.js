// src/services/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Más adelante, aquí configuraremos los "interceptors" para manejar errores
// o la renovación de tokens de forma global.

export default apiClient;