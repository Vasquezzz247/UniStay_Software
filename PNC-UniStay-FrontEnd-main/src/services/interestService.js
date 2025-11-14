import apiClient from './apiClient';

/**
 * Centraliza el manejo de errores de Axios. Es crucial para preservar
 * el objeto de error completo que envía el backend.
 * @param {Error} error - El error original capturado de Axios.
 */
const handleError = (error) => {
  if (error.response && error.response.data) {
    throw error.response.data;
  }
  throw { message: error.message || 'No se pudo conectar al servidor.' };
};

// --- FUNCIÓN NUEVA AÑADIDA ---
/**
 * Obtiene las solicitudes aceptadas por un propietario que aún no tienen un pago generado.
 */
export const getAcceptedRequestsForOwner = async () => {
  try {
    // Llama al nuevo endpoint del backend
    const response = await apiClient.get('/interests/owner/accepted');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


// --- TUS FUNCIONES EXISTENTES (SIN CAMBIOS) ---

/**
 * Obtiene las solicitudes recibidas por el propietario autenticado.
 */
export const getReceivedRequests = async () => {
  try {
    const response = await apiClient.get('/interests/received');
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Obtiene las solicitudes enviadas por el estudiante autenticado.
 */
export const getMyRequests = async () => {
    try {
      const response = await apiClient.get('/interests/mine');
      return response.data;
    } catch (error) {
      handleError(error);
    }
};

/**
 * Obtiene una solicitud de interés específica por su ID.
 */
export const getInterestById = async (interestId) => {
  if (!interestId) throw new Error("El ID de la solicitud es requerido.");
  try {
    const response = await apiClient.get(`/interests/${interestId}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Permite a un estudiante confirmar o rechazar una propuesta de cita.
 */
export const confirmAppointment = async (interestId, chosenSlot) => {
  if (!interestId || !chosenSlot) {
    throw new Error('Se requiere el ID de la solicitud y el horario elegido.');
  }
  try {
    const payload = { chosenSlot: new Date(chosenSlot).toISOString() };
    const response = await apiClient.patch(`/interests/${interestId}/appointment/confirm`, payload);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};


/**
 * Permite a un propietario proponer un rango de disponibilidad.
 */
export const proposeAvailability = async (interestId, availabilityData) => {
  if (!interestId) throw new Error('El ID de la solicitud es requerido.');
  try {
    const response = await apiClient.patch(`/interests/${interestId}/availability`, availabilityData);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Crea una nueva solicitud de interés para un post.
 */
export const createInterestRequest = async (postId) => {
  if (!postId) throw new Error('El ID del post es requerido para enviar una solicitud.');
  try {
    const response = await apiClient.post('/interests', { postId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

/**
 * Crea una nueva solicitud de interés.
 */
export const createInterest = async (postId) => {
  if (!postId) throw new Error('El ID del post es requerido para crear una solicitud.');
  try {
    const response = await apiClient.post('/interests', { postId });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};