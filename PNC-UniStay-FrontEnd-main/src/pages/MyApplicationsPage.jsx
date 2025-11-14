import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getMyRequests, confirmAppointment } from '../services/interestService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import ConfirmModal from '../components/ui/ConfirmModal';
import { toast } from 'react-toastify';
import { FaBuilding, FaClock, FaCheck, FaTimes, FaSearch, FaCheckCircle, FaCalendarCheck } from 'react-icons/fa';

// --- Componente para generar y mostrar los horarios disponibles ---
const AvailabilityPicker = ({ request, onSlotSelect }) => {
    
    // Función para generar los "slots" de tiempo
    const availableSlots = useMemo(() => {
        const slotsByDay = {};
        if (!request.availabilityStartDate || !request.availabilityEndDate || !request.availabilityStartTime || !request.availabilityEndTime) {
            return slotsByDay;
        }

        const start = new Date(request.availabilityStartDate + 'T00:00:00');
        const end = new Date(request.availabilityEndDate + 'T00:00:00');
        const startTime = request.availabilityStartTime.split(':').map(Number);
        const endTime = request.availabilityEndTime.split(':').map(Number);
        const duration = request.slotDurationMinutes;

        for (let day = new Date(start); day <= end; day.setDate(day.getDate() + 1)) {
            const dayKey = day.toISOString().split('T')[0];
            slotsByDay[dayKey] = [];
            
            let currentTime = new Date(day);
            currentTime.setHours(startTime[0], startTime[1], 0, 0);

            let limitTime = new Date(day);
            limitTime.setHours(endTime[0], endTime[1], 0, 0);

            while (currentTime < limitTime) {
                slotsByDay[dayKey].push(new Date(currentTime));
                currentTime.setMinutes(currentTime.getMinutes() + duration);
            }
        }
        return slotsByDay;
    }, [request]);

    const dayFormatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeFormatter = new Intl.DateTimeFormat('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true });

    return (
        <div className="mt-4 pt-4 border-t border-dashed">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Elige un horario para tu visita:</h3>
            <div className="space-y-4">
                {Object.entries(availableSlots).map(([day, slots]) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const currentDay = new Date(day + 'T00:00:00');
                    if (currentDay < today) return null;

                    return (
                        <div key={day}>
                            <p className="font-bold text-gray-700 mb-2 capitalize">{dayFormatter.format(currentDay)}</p>
                            <div className="flex flex-wrap gap-2">
                                {slots.map(slot => {
                                    const isPast = new Date() > slot;
                                    return (
                                        <button 
                                            key={slot.toISOString()} 
                                            onClick={() => {
                                                if (isPast) {
                                                    toast.error("No puedes seleccionar una fecha u hora que ya ha pasado.");
                                                } else {
                                                    onSlotSelect(slot);
                                                }
                                            }}
                                            disabled={isPast}
                                            className={`px-4 py-2 rounded-md transition ${
                                                isPast 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed line-through' 
                                                : 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                                            }`}
                                        >
                                            {timeFormatter.format(slot)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const ApplicationStatusCard = ({ request, onConfirm }) => {
  const getStatusInfo = (status) => {
    switch(status) {
        case 'PENDING': return { text: 'Pendiente', color: 'bg-gray-200 text-gray-800' };
        case 'IN_CONTACT': return { text: 'Disponibilidad Recibida', color: 'bg-yellow-100 text-yellow-800' };
        case 'ACCEPTED': return { text: 'Cita Confirmada', color: 'bg-green-100 text-green-800' };
        case 'REJECTED': return { text: 'Rechazada', color: 'bg-red-100 text-red-800' };
        case 'CLOSED': return { text: 'Cerrada', color: 'bg-gray-200 text-gray-500' };
        default: return { text: status, color: 'bg-gray-200' };
    }
  };
  
  const { text, color } = getStatusInfo(request.status);

  const showAvailabilityPicker = request.availabilityStartDate && !request.appointmentConfirmedByStudent && request.status !== 'CLOSED';
  const showConfirmationMessage = request.appointmentConfirmedByStudent;

  return (
    <div className="bg-white p-5 rounded-lg border shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Aplicación para:</p>
          <Link to={`/posts/${request.postId}`} className="font-bold text-lg text-gray-800 hover:text-sky-600">{request.postTitle}</Link>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color}`}>{text}</span>
      </div>
      
      {showAvailabilityPicker && <AvailabilityPicker request={request} onSlotSelect={onConfirm} />}

      {showConfirmationMessage && (
          <div className="mt-4 pt-4 border-t border-dashed">
             <div className="p-4 bg-green-50 rounded-md border border-green-200 text-sm text-green-800 flex items-center">
                 <FaCheckCircle className="w-5 h-5 mr-3"/>
                 <div>
                    <p className="font-bold">¡Cita confirmada!</p>
                    <p>Fecha: {new Date(request.appointmentDateTime).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' })}</p>
                 </div>
             </div>
          </div>
      )}
    </div>
  );
};


export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const response = await getMyRequests();
      setApplications(response.data || []);
    } catch (err) {
      setError(err.message || "Ocurrió un error al obtener tus aplicaciones.");
    } finally {
      setLoading(false);
    }
  };

  const handleSlotSelection = (request, slot) => {
    setSelectedRequest(request);
    setSelectedSlot(slot);
    setShowConfirmModal(true);
  };

  const handleAppointmentConfirmation = async () => {
    if (!selectedRequest || !selectedSlot) return;
    try {
      await confirmAppointment(selectedRequest.id, selectedSlot);
      toast.success('¡Cita confirmada exitosamente!');
      fetchMyApplications();
    } catch (err) {
      toast.error(err.message || 'No se pudo confirmar la cita.');
    } finally {
      setShowConfirmModal(false);
      setSelectedRequest(null);
      setSelectedSlot(null);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Aplicaciones</h1>
        
        {applications.length === 0 ? (
          <EmptyState
              icon={FaSearch}
              title="No has enviado aplicaciones"
              message="Cuando encuentres una publicación que te interese, podrás enviar una aplicación y ver su estado aquí."
              buttonText="Explorar Publicaciones"
              buttonTo="/posts"
          />
        ) : (
          <div className="space-y-4">
            {applications.map(req => (
              <ApplicationStatusCard 
                key={req.id} 
                request={req} 
                onConfirm={(slot) => handleSlotSelection(req, slot)} 
              />
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleAppointmentConfirmation}
        title="Confirmar Cita"
        message={`¿Estás seguro de que quieres agendar tu visita para el ${selectedSlot ? new Date(selectedSlot).toLocaleString('es-SV', { dateStyle: 'full', timeStyle: 'short' }) : ''}?`}
        confirmText="Sí, Confirmar"
        icon={FaCalendarCheck}
      />
    </>
  );
}