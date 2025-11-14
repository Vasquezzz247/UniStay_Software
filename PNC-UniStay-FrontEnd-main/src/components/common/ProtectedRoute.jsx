// src/components/common/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Ajusta la ruta si es necesario
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // 1. Si aún estamos en el proceso de verificar el token inicial, 
  // mostramos un mensaje de carga. Esto es CRUCIAL para evitar que el
  // usuario sea redirigido a /login brevemente al recargar la página.
  if (isLoading) {
    return <div>Verificando autenticación...</div>; // O un componente de Spinner/Loader
  }

  // 2. Si la carga terminó y el usuario NO está autenticado,
  // lo redirigimos a la página de login.
  if (!isAuthenticated) {
    // Guardamos la página a la que intentaba acceder (location) para que,
    // después del login, podamos redirigirlo de vuelta a ella.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Si la carga terminó y el usuario SÍ está autenticado,
  // renderizamos el componente hijo (la página que estamos protegiendo).
  return children;
};

export default ProtectedRoute;