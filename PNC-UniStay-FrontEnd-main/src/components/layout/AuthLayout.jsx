// src/components/layout/AuthLayout.jsx

import React from 'react';
import { ShieldCheck, Users, Star } from 'lucide-react'; // Instala lucide-react: npm install lucide-react

const AuthLayout = ({ children, title, subtitle }) => {
  const features = [
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Comunidad estudiantil",
      description: "Conecta con otros estudiantes"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-indigo-600" />,
      title: "Propietarios verificados",
      description: "Todos nuestros anunciantes están verificados"
    },
    {
      icon: <Star className="h-6 w-6 text-indigo-600" />,
      title: "Propiedades de calidad",
      description: "Solo las mejores opciones para estudiantes"
    }
  ];

  return (
    <div className="flex min-h-screen bg-white">
      {/* Columna Izquierda: Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-left">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="mt-2 text-gray-600">{subtitle}</p>
          </div>
          {children} {/* Aquí se renderizará el formulario de Login o Register */}
        </div>
      </div>

      {/* Columna Derecha: Marketing */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center bg-gray-50 p-12 text-gray-800">
        <div className="max-w-md">
           <div className="text-center mb-10">
              <span className="text-3xl font-bold text-indigo-600">UniStay</span>
           </div>
          <h2 className="text-3xl font-bold mb-4">
            Encuentra tu hogar ideal cerca del campus
          </h2>
          <p className="mb-8 text-gray-600">
            UniStay conecta estudiantes con propietarios verificados, ofreciendo las mejores opciones de alojamiento cerca de universidades.
          </p>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
                  {feature.icon}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
