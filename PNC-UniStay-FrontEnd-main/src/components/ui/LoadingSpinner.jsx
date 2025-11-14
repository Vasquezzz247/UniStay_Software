import React from 'react';

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-20">
      {/* Esto crea un spinner simple con Tailwind CSS */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-600"></div>
      <p className="ml-4 text-xl text-sky-600 font-semibold">Cargando...</p>
    </div>
  );
}

export default LoadingSpinner; 