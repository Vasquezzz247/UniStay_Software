import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { getInterestById, proposeAvailability } from '../services/interestService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { toast } from 'react-toastify';
// --- INICIO DE LA CORRECCIÓN: Añadimos FaClock al import ---
import { 
  FaUser, FaBuilding, FaArrowLeft, FaCalendarAlt, FaPaperPlane, 
  FaHourglassHalf, FaCheckCircle, FaClock, FaCommentDots 
} from 'react-icons/fa';
// --- FIN DE LA CORRECCIÓN ---


// --- Sub-componente: Muestra la propuesta enviada mientras se espera respuesta ---
const ProposalDetails = ({ requestData }) => (
  <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
    <h2 className="text-lg font-bold text-yellow-800 mb-4">Propuesta Enviada</h2>
    <div className="space-y-3 text-sm">
      <div className="flex items-center">
        <FaCalendarAlt className="w-4 h-4 mr-3 text-yellow-600"/>
        <span className="font-semibold text-gray-700">Rango de Fechas:</span>
        <span className="ml-2 text-gray-800">
          {new Date(requestData.availabilityStartDate + 'T00:00:00').toLocaleDateString('es-SV')} al {new Date(requestData.availabilityEndDate + 'T00:00:00').toLocaleDateString('es-SV')}
        </span>
      </div>
      <div className="flex items-center">
        <FaClock className="w-4 h-4 mr-3 text-yellow-600"/>
        <span className="font-semibold text-gray-700">Horario Disponible:</span>
        <span className="ml-2 text-gray-800">
            {requestData.availabilityStartTime} - {requestData.availabilityEndTime}
        </span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-yellow-200 flex items-center text-xs text-yellow-700">
      <FaHourglassHalf className="mr-2"/>
      Esperando que el estudiante seleccione un horario.
    </div>
  </div>
);

// --- Sub-componente: Muestra la cita ya confirmada ---
const ConfirmedAppointmentDetails = ({ requestData }) => (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
    <h2 className="text-lg font-bold text-green-800 mb-4 flex items-center">
        <FaCheckCircle className="mr-2"/>
        Cita Confirmada
    </h2>
    <div className="space-y-3 text-sm">
      <div className="flex items-center">
        <FaCalendarAlt className="w-4 h-4 mr-3 text-green-600"/>
        <span className="font-semibold text-gray-700">Fecha y Hora Acordada:</span>
        <span className="ml-2 text-gray-800 font-bold">
          {new Date(requestData.appointmentDateTime).toLocaleString('es-SV', { dateStyle: 'long', timeStyle: 'short' })}
        </span>
      </div>
    </div>
    <div className="mt-4 pt-4 border-t border-green-200 text-xs text-green-700">
      Todo listo para la visita. ¡Prepara la habitación!
    </div>
  </div>
);


// --- Sub-componente: Formulario para proponer disponibilidad ---
const AvailabilityForm = ({ onSubmit, isSubmitting }) => {
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const [startDate, setStartDate] = useState(getTomorrow());
  const [endDate, setEndDate] = useState(getTomorrow());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(30);
  const [message, setMessage] = useState('');

  const timeOptions = [];
  for (let i = 0; i < 48; i++) {
    const date = new Date(0, 0, 0, 0, i * 30);
    const time = date.toTimeString().slice(0, 5);
    timeOptions.push(time);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const proposal = {
      availabilityStartDate: startDate.toISOString().split('T')[0],
      availabilityEndDate: endDate.toISOString().split('T')[0],
      availabilityStartTime: startTime,
      availabilityEndTime: endTime,
      slotDurationMinutes: parseInt(slotDuration, 10),
      message: message,
    };
    onSubmit(proposal);
  };
  
  useEffect(() => {
    if (startDate > endDate) {
        setEndDate(startDate);
    }
  }, [startDate, endDate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde la fecha:</label>
          <DatePicker selected={startDate} onChange={date => setStartDate(date)} dateFormat="dd/MM/yyyy" className="w-full border-gray-300 rounded-md shadow-sm p-2" minDate={getTomorrow()}/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta la fecha:</label>
          <DatePicker selected={endDate} onChange={date => setEndDate(date)} dateFormat="dd/MM/yyyy" className="w-full border-gray-300 rounded-md shadow-sm p-2" minDate={startDate}/>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde la hora:</label>
          <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2">
            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta la hora:</label>
          <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2">
            {timeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Duración de cada cita (minutos):</label>
        <select value={slotDuration} onChange={e => setSlotDuration(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm p-2">
          <option value={15}>15 minutos</option>
          <option value={30}>30 minutos</option>
          <option value={45}>45 minutos</option>
          <option value={60}>60 minutos</option>
        </select>
      </div>
       <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje Adicional:</label>
        <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={3} className="w-full border-gray-300 rounded-md shadow-sm p-2" placeholder="Ej. ¡Hola! Esta es mi disponibilidad para que veas la habitación."/>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-semibold bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400">
        <FaPaperPlane />
        {isSubmitting ? 'Enviando...' : 'Enviar Disponibilidad'}
      </button>
    </form>
  );
};

export default function ScheduleAppointment() {
  const { id: requestId } = useParams();
  
  const [requestData, setRequestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRequestDetails = async () => {
    if (!requestId) {
        setError('ID de solicitud no encontrado.');
        setLoading(false);
        return;
    }
    try {
      setLoading(true);
      const response = await getInterestById(requestId);
      setRequestData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const handleProposeAvailability = async (proposal) => {
    setIsSubmitting(true);
    try {
      const response = await proposeAvailability(requestId, proposal);
      setRequestData(response.data);
      toast.success('Disponibilidad enviada exitosamente.');
    } catch (err) {
      toast.error(err.message || 'Error al enviar la disponibilidad.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;
  if (!requestData) return <ErrorMessage message="No se encontraron datos para esta solicitud." />;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link to="/requests" className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 group text-sm font-medium">
        <FaArrowLeft className="mr-2 h-3 w-3" />
        Volver a Solicitudes
      </Link>
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl border">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestionar Cita</h1>
        <p className="text-sm text-gray-500 mb-8 border-b pb-4">Ofrece tu disponibilidad para que el estudiante agende una visita.</p>
        
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Detalles de la Solicitud</h2>
          <div className="space-y-2">
            <div className="flex items-center text-sm"><FaUser className="mr-3 w-4"/> {requestData.studentName} ({requestData.studentEmail})</div>
            <div className="flex items-center text-sm"><FaBuilding className="mr-3 w-4"/> <Link to={`/posts/${requestData.postId}`} className="text-sky-600 hover:underline">{requestData.postTitle}</Link></div>
          </div>
        </div>

        {requestData.appointmentConfirmedByStudent ? (
            <ConfirmedAppointmentDetails requestData={requestData} />
        ) : requestData.availabilityStartDate ? (
            <ProposalDetails requestData={requestData} />
        ) : (
            <AvailabilityForm onSubmit={handleProposeAvailability} isSubmitting={isSubmitting} />
        )}
      </div>
    </div>
  );
}