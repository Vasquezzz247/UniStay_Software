import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedRequests } from '../services/interestService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { FaUserCircle, FaEnvelope, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';

// --- Tarjeta de Solicitud (Simplificada) ---
const RequestCard = ({ request, onClick }) => {

  const getStatusInfo = (status, confirmed) => {
    if (confirmed) {
      return { text: 'Cita Confirmada', color: 'bg-green-100 text-green-800' };
    }
    switch (status) {
      case 'IN_CONTACT': return { text: 'Propuesta Enviada', color: 'bg-yellow-100 text-yellow-800' };
      // ... otros estados
      default: return { text: status, color: 'bg-gray-100' };
    }
  };

  const { text, color } = getStatusInfo(request.status, request.appointmentConfirmedByStudent);

  return (
    <div
      onClick={onClick}
      className="bg-white p-5 rounded-lg border shadow-sm transition-shadow hover:shadow-md cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <FaUserCircle className="h-10 w-10 text-gray-400" />
          <div>
            <p className="font-bold text-gray-800">{request.studentName || 'Estudiante Anónimo'}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <FaEnvelope className="mr-2" />
              <span>{request.studentEmail || 'No disponible'}</span>
            </div>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{text}</span>
      </div>

      {/* --- SECCIÓN SIMPLIFICADA --- */}
      {/* Ya no hay botón de pago. Solo muestra el estado final. */}
      {request.appointmentConfirmedByStudent ? (
        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="p-3 bg-green-50 rounded-md border border-green-200 text-sm text-green-800 flex items-center">
            <FaCheckCircle className="w-4 h-4 mr-3"/>
            <span>El estudiante aceptó la cita. Gestiona el pago en el historial de pagos.</span>
          </div>
        </div>
      ) : request.appointmentDateTime ? (
        <div className="mt-4 pt-4 border-t border-dashed">
          <div className="p-3 bg-yellow-50 rounded-md border border-yellow-200 text-sm text-yellow-800 flex items-center">
            <FaHourglassHalf className="w-4 h-4 mr-3"/>
            <span>Esperando respuesta del estudiante.</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};


function ReceivedRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadRequestsData();
  }, []);

  const loadRequestsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getReceivedRequests();
      setRequests(response.data || []);
    } catch (err) {
      setError(err.message || 'Ocurrió un error al obtener las solicitudes.');
    } finally {
      setLoading(false);
    }
  };

  // El propietario ya no genera el pago desde aquí, así que el handler se elimina.
  // Al hacer clic en la tarjeta, se navega al detalle de la cita.
  const handleClick = (id) => {
    navigate(`/requests/${id}`);
  };

  if (loading) return <div className="flex items-center justify-center h-96"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Solicitudes Recibidas</h1>
      
      {requests.length === 0 ? (
        <EmptyState
            icon={FaEnvelope}
            title="No tienes solicitudes"
            message="Cuando un estudiante esté interesado en una de tus publicaciones, verás su solicitud aquí."
            buttonText="Ver Mis Publicaciones"
            buttonTo="/my-posts"
        />
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onClick={() => handleClick(req.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReceivedRequests;