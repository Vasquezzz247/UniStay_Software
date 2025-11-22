// src/components/common/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 🔍 Fallback: también revisamos el localStorage por si el contexto
  // todavía no se ha actualizado (por ejemplo, justo después de login con Google).
  const storedToken =
    localStorage.getItem('userToken') || localStorage.getItem('token');

  // 1. Mientras el AuthContext está cargando, mostramos algo neutro
  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  // 2. Si NO hay autenticación en el contexto y TAMPOCO hay token guardado,
  // mandamos al login.
  if (!isAuthenticated && !storedToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si hay auth o al menos hay token en localStorage, dejamos pasar.
  return children;
};

export default ProtectedRoute;