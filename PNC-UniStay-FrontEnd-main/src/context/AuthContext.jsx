// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { register as registerService, login as loginService, logout as logoutService } from '../services/authService';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Función unificada para actualizar el estado desde un token
  const updateUserState = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      // Guardamos el email Y los roles en el estado del usuario
      setUser({
        email: decodedToken.sub,
        roles: decodedToken.roles || [],
      });
      setToken(token);
      setIsAuthenticated(true);
      // Configuramos el header de Axios para futuras peticiones
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
      console.error("Token en localStorage es inválido o expiró", error);
      logout(); // Llama a la función logout de este contexto si el token es malo
    }
  };
  
  useEffect(() => {
    // Al cargar la app, revisa si hay un token persistido
    const storedToken = localStorage.getItem('userToken');
    if (storedToken) {
      updateUserState(storedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await loginService(credentials);
    // loginService ya guarda en localStorage. Ahora actualizamos el estado.
    updateUserState(data.token);
  };
  
  const logout = () => {
    logoutService(); // Llama al servicio para limpiar localStorage y Axios
    // Limpiamos el estado local
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  const register = async (userData) => {
    return await registerService(userData);
  };

  const value = { user, isAuthenticated, isLoading, login, logout, register };

  // Muestra un loader mientras se verifica el token inicial
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => useContext(AuthContext);
