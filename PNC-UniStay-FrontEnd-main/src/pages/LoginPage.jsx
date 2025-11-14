// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLoading) return;
    try {
      await login({ email, password });
      navigate('/'); // Redirige a la página principal tras el login
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión en tu cuenta para encontrar tu hogar ideal"
    >
      <div className="p-8 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">Iniciar Sesión</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6">Ingresa tus credenciales para acceder a tu cuenta</p>
        
        {successMessage && <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{successMessage}</div>}
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Tu contraseña"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'} <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
      <p className="mt-6 text-sm text-center text-gray-600">
        ¿No tienes una cuenta?{' '}
        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
          Regístrate aquí
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
