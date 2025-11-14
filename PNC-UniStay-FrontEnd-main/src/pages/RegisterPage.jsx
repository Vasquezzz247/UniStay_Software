// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { User, Home, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    // --- CORRECCIÓN 1: El valor por defecto ahora es ESTUDIANTE ---
    userType: 'ESTUDIANTE', 
  });
  const [error, setError] = useState('');
  
  // Asumo que tienes una variable isLoading en tu contexto para deshabilitar el botón
  const { register, isLoading } = useAuth(); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLoading) return;

    try {
      await register(formData);
      navigate('/login', { state: { message: '¡Registro exitoso! Ahora puedes iniciar sesión.' } });
    } catch (err) {
      setError(err.message || 'Error en el registro. Inténtalo de nuevo.');
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Únete a nuestra comunidad para encontrar tu próximo hogar"
    >
      <div className="p-8 border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-800">Registro</h3>
        <p className="text-sm text-gray-500 mt-1 mb-6">Completa los siguientes campos para continuar</p>
        
        {error && <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input name="firstName" type="text" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Tu nombre" />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input name="lastName" type="text" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Tu apellido"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="tu@email.com"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input name="password" type="password" required minLength="8" onChange={handleChange} className="w-full px-3 py-2 border rounded-md" placeholder="Mínimo 8 caracteres"/>
          </div>
          
          <div className="space-y-2 pt-2">
            <label className="block text-sm font-medium text-gray-700">Quiero registrarme como:</label>
            <div className="flex items-center gap-x-6 border border-gray-200 rounded-lg p-2">
              <label className="flex-1 flex items-center justify-center p-2 rounded-md cursor-pointer transition-all" style={formData.userType === 'ESTUDIANTE' ? {backgroundColor: '#EEF2FF', color: '#4338CA'} : {}}>
                {/* --- CORRECCIÓN 2: El valor ahora es ESTUDIANTE --- */}
                <input type="radio" name="userType" value="ESTUDIANTE" checked={formData.userType === 'ESTUDIANTE'} onChange={handleChange} className="sr-only" />
                <User className="h-5 w-5 mr-2" />
                {/* --- CORRECCIÓN 3: El texto de la etiqueta ahora es Estudiante --- */}
                <span className="font-medium">Estudiante</span>
              </label>
              <label className="flex-1 flex items-center justify-center p-2 rounded-md cursor-pointer transition-all" style={formData.userType === 'PROPIETARIO' ? {backgroundColor: '#EEF2FF', color: '#4338CA'} : {}}>
                <input type="radio" name="userType" value="PROPIETARIO" checked={formData.userType === 'PROPIETARIO'} onChange={handleChange} className="sr-only" />
                <Home className="h-5 w-5 mr-2" />
                <span className="font-medium">Propietario</span>
              </label>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">
            {isLoading ? 'Registrando...' : 'Crear Cuenta'} <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
       <p className="mt-6 text-sm text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Inicia sesión
          </Link>
        </p>
    </AuthLayout>
  );
};

export default RegisterPage;
