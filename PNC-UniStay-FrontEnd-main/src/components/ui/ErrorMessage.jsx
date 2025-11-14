import React from 'react';

function ErrorMessage({ message }) {
  return (
    <div className="container mx-auto px-4 py-10 text-center">
      <div 
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md max-w-lg mx-auto" 
        role="alert"
      >
        <p className="font-bold text-xl mb-2">¡Oops! Algo salió mal</p>
        <p>{message || 'No se pudo cargar la información. Por favor, inténtalo de nuevo más tarde.'}</p>
      </div>
    </div>
  );
}

export default ErrorMessage;