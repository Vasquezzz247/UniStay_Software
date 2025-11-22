// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

// Google Login + apiClient
import { GoogleLogin } from '@react-oauth/google';
import apiClient from '../services/apiClient';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithToken, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  // ---------- LOGIN NORMAL ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLoading) return;

    try {
      await login({ email, password });
      navigate('/posts', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  // ---------- LOGIN CON GOOGLE ----------
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const { data } = await apiClient.post('/auth/google-login', { idToken });

      // Soportar { token } o { data: { token } }
      const backendToken = data?.token ?? data?.data?.token ?? data;

      if (!backendToken) {
        throw new Error('La respuesta del servidor no contiene token');
      }

      // Mismo flujo que el login normal
      loginWithToken(backendToken);

      navigate('/posts', { replace: true });
    } catch (err) {
      console.error('Error en login con Google:', err);
      setError('No se pudo iniciar sesión con Google.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google Login Failed');
    setError('No se pudo iniciar sesión con Google.');
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión en tu cuenta para encontrar tu hogar ideal"
    >
      <div className="p-8 border border-gray-200 rounded-xl shadow-sm bg-white">
        <h3 className="text-xl font-semibold text-gray-800">Iniciar Sesión</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>

        {successMessage && (
          <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
            <ArrowRight className="h-5 w-5" />
          </button>
        </form>

        {/* Separador + botón de Google */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-gray-400">
                o continúa con
              </span>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm text-center text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link
          to="/register"
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Regístrate aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;