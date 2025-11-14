// src/services/authService.js
import apiClient from './apiClient'; // Importamos la misma instancia de Axios que usan los otros servicios

/**
 * Envía una petición para registrar un nuevo usuario.
 * @param {object} userData - { firstName, lastName, email, password, userType }
 * @returns {Promise<object>} Los datos del usuario creado.
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    // Extraemos el mensaje de error del backend para mostrarlo al usuario
    console.error("Error en el registro:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Ocurrió un error durante el registro.');
  }
};

/**
 * Envía las credenciales para iniciar sesión.
 * Si tiene éxito, guarda el token y configura el header de autorización por defecto en Axios.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} La respuesta del login, que incluye el token.
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    
    // La magia sucede aquí
    if (response.data && response.data.token) {
      const { token } = response.data;

      // 1. Guardamos el token en el almacenamiento local del navegador.
      // Esto nos permitirá mantener al usuario logueado si recarga la página.
      localStorage.setItem('userToken', token);

      // 2. Configuramos el header de autorización para TODAS las futuras peticiones de Axios.
      // A partir de aquí, cualquier llamada con 'apiClient' (en postService, roomService, etc.)
      // incluirá automáticamente este header.
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      console.log("Login exitoso. Token configurado.");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error en el login:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Email o contraseña incorrectos.');
  }
};

/**
 * Cierra la sesión del usuario.
 * Limpia el token del almacenamiento y de la configuración de Axios.
 */
export const logout = () => {
  // 1. Eliminamos el token del almacenamiento local.
  localStorage.removeItem('userToken');

  // 2. Eliminamos el header de autorización de la configuración de Axios.
  delete apiClient.defaults.headers.common['Authorization'];

  console.log("Logout exitoso. Token eliminado.");
};

/**
 * Función para verificar si hay un token almacenado
 * y configurar los encabezados de Axios para peticiones posteriores
 */
export const setupAuthToken = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    // Si el token existe en localStorage, lo añadimos a los headers de Axios
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    // Si no hay token, eliminamos el header de Authorization
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Llamamos a setupAuthToken cuando la aplicación se inicia
setupAuthToken();
