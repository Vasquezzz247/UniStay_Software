import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaUser, FaCalendar, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

function PaymentFormModal({
  isOpen,
  onClose,
  onSubmit,
  paymentDetails
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Estados para los campos (solo para la simulación visual)
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Validación simple para la simulación
    if (!cardInfo.number || !cardInfo.name || !cardInfo.expiry || !cardInfo.cvc) {
        toast.warn("Por favor, completa todos los campos de la tarjeta.");
        return;
    }
    
    setIsProcessing(true);
    // Simula un retraso de la pasarela de pago
    setTimeout(() => {
        onSubmit(); // Llama a la función de confirmación real
        setIsProcessing(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg leading-6 font-bold text-gray-900">Realizar Pago Seguro</h3>
              <p className="text-sm text-gray-500 mt-1">Para la publicación: "{paymentDetails?.postTitle}"</p>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Número de Tarjeta</label>
              <div className="relative mt-1">
                <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" id="card-number" name="number" value={cardInfo.number} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md" placeholder="0000 0000 0000 0000" />
              </div>
            </div>

            <div>
              <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">Nombre en la Tarjeta</label>
              <div className="relative mt-1">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" id="card-name" name="name" value={cardInfo.name} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md" placeholder="Juan Pérez" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700">Expiración (MM/AA)</label>
                <div className="relative mt-1">
                  <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="card-expiry" name="expiry" value={cardInfo.expiry} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md" placeholder="12/28" />
                </div>
              </div>
              <div>
                <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700">CVC</label>
                 <div className="relative mt-1">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" id="card-cvc" name="cvc" value={cardInfo.cvc} onChange={handleInputChange} className="w-full pl-10 pr-3 py-2 border-gray-300 rounded-md" placeholder="123" />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 disabled:bg-sky-300 transition-colors"
              >
                {isProcessing ? 'Procesando...' : `Pagar $${paymentDetails?.amount?.toFixed(2) || '0.00'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentFormModal;