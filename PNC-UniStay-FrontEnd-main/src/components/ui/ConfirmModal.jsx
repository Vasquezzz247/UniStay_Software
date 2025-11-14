import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash, FaCheckCircle } from 'react-icons/fa'; // Iconos

function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar Acción",
  message = "¿Estás seguro de que quieres realizar esta acción?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmButtonColor = "bg-red-600 hover:bg-red-700", // Color por defecto para acciones destructivas
  icon: Icon // Permite pasar un ícono específico para el modal
}) {
  if (!isOpen) {
    return null;
  }

  // Icono por defecto si no se proporciona uno
  const ModalIcon = Icon || FaExclamationTriangle;

  return (
    // Overlay de fondo
    <div 
      className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Cierra el modal si se hace clic fuera (opcional)
    >
      {/* Contenedor del Modal */}
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-appear"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div className="flex items-center">
            <ModalIcon className={`h-6 w-6 mr-3 ${confirmButtonColor.includes('red') ? 'text-red-500' : 'text-sky-500'}`} />
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar modal"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
        </div>

        {/* Pie del Modal (Botones) */}
        <div className="flex justify-end items-center p-5 bg-gray-50 border-t border-gray-200 rounded-b-lg space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${confirmButtonColor} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-75 transition-colors`}
          >
            {confirmText}
          </button>
        </div>
      </div>
      {/* Animación para aparecer (añadir a tu index.css o un archivo CSS global) */}
      {/* @keyframes modal-appear {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-modal-appear {
          animation: modal-appear 0.3s ease-out forwards;
        }
      */}
    </div>
  );
}

export default ConfirmModal;