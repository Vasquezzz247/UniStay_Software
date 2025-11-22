// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  register as registerService,
  login as loginService,
  logout as logoutService,
} from '../services/authService';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ---------- Función unificada para actualizar el estado desde un token ----------
  const updateUserState = (jwt) => {
    try {
      const decodedToken = jwtDecode(jwt);

      setUser({
        email: decodedToken.sub,
        roles: decodedToken.roles || [],
      });
      setToken(jwt);
      setIsAuthenticated(true);

      // Header Authorization para todas las peticiones
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    } catch (error) {
      console.error('Token en localStorage es inválido o expiró', error);
      logout();
    }
  };

  // ---------- Login con un token ya generado (Google, etc.) ----------
  const loginWithToken = (jwt) => {
    if (!jwt) return;

    // Solo usamos userToken como clave "oficial"
    localStorage.setItem('userToken', jwt);
    // Por si quedó viejo, limpiamos la otra
    localStorage.removeItem('token');

    updateUserState(jwt);
  };

  // ---------- Al cargar la app: leer token persistido ----------
  useEffect(() => {
    let storedToken =
      localStorage.getItem('userToken') || localStorage.getItem('token');

    if (storedToken) {
      // Normalizamos: si solo existía "token", lo pasamos a "userToken"
      if (!localStorage.getItem('userToken')) {
        localStorage.setItem('userToken', storedToken);
      }
      localStorage.removeItem('token');

      loginWithToken(storedToken);
    }

    setIsLoading(false);
  }, []);

  // ---------- Login normal (email + password) ----------
  const login = async (credentials) => {
    const data = await loginService(credentials);
    const backendToken = data?.token ?? data?.data?.token ?? data;

    if (!backendToken) {
      throw new Error('La respuesta de login no contiene token');
    }

    loginWithToken(backendToken);
  };

  const logout = () => {
    logoutService(); // limpia lo que tengas en el servicio

    // Limpiamos estado local
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);

    // Limpiamos headers y storage
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('userToken');
    localStorage.removeItem('token'); // por si quedó alguno viejo
  };

  const register = async (userData) => {
    return await registerService(userData);
  };

  const value = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    loginWithToken, // 👈 lo usamos en el login con Google
    logout,
    register,
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);