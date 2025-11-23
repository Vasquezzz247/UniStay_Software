// src/services/apiClient.js
import axios from 'axios';

// Base desde .env
let baseURL = import.meta.env.VITE_BACKEND_URL || 'http://services-cuponera.alwaysdata.net:8377';

// Normalizar: quitar "/" final
baseURL = baseURL.replace(/\/$/, "");

// Asegurar que termine con "/api"
if (!baseURL.endsWith("/api")) {
  baseURL += "/api";
}

const apiClient = axios.create({
  baseURL,
});

export default apiClient;