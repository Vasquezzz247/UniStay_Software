import apiClient from './apiClient';

/**
 * Centraliza el manejo de errores de Axios.
 * @param {Error} error - El error original capturado de Axios.
 */
const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw { message: error.message || 'No se pudo conectar al servidor.' };
};


// --- FUNCIÓN AÑADIDA PARA REGENERAR PAGOS ---
/**
 * Llama al backend para generar un nuevo pago a partir de uno anterior.
 * @param {string} previousPaymentId - El ID del pago que ya fue completado.
 */
export const regeneratePayment = async (previousPaymentId) => {
    try {
        // Llama al nuevo endpoint que creamos en el backend.
        const response = await apiClient.post(`/payments/${previousPaymentId}/regenerate`);
        return response.data;
    } catch(error) {
        handleError(error);
    }
}
// ------------------------------------------


export const getPaymentsByOwner = async () => {
    try {
        const response = await apiClient.get('/payments/owner/mine');
        return response.data;
    } catch(error) {
        handleError(error);
    }
}

export const getMyPayments = async () => {
  try {
    const response = await apiClient.get('/payments/mine');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const makePaymentRequest = async (interestRequestId) => {
  try {
    const payload = { interestRequestId };
    const response = await apiClient.post('/payments', payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const confirmPayment = async (paymentId) => {
  try {
    const response = await apiClient.patch(`/payments/${paymentId}/confirm`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getPaymentsByStudent = async (studentId) => {
  try {
    const response = await apiClient.get(`/payments/student/${studentId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};