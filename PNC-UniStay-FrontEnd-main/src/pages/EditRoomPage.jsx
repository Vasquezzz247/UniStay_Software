import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import RoomForm from '../components/room/RoomForm';
import { getRoomById, updateRoom } from '../services/roomService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';

function EditRoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [initialRoomData, setInitialRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) {
        setError("ID de habitación no especificado para editar.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const roomDataFromApi = await getRoomById(roomId);
        // RoomResponse ya tiene roomId, description, address, available, etc.
        // y los nuevos campos como squareFootage, amenities...
        setInitialRoomData(roomDataFromApi); 
      } catch (err) {
        setError(err.message || "Error al cargar los datos de la habitación.");
        setInitialRoomData({}); // Para evitar que el form intente renderizar con null
      } finally {
        setIsLoading(false);
      }
    };
    fetchRoomData();
  }, [roomId]);

  const stableInitialData = useMemo(() => initialRoomData || {}, [initialRoomData]);

  const handleUpdateRoom = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // formData ya incluye roomId si RoomForm y initialRoomData lo manejan
      const response = await updateRoom(roomId, formData); // Pasamos roomId del path también
      alert(response.message || '¡Habitación actualizada exitosamente!');
      navigate(`/rooms`); // O a la página de detalle: `/rooms/${roomId}`
    } catch (err) {
      setError(err.message || 'Error al actualizar la habitación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/rooms'); 
  };

  if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  // Si hubo un error al cargar Y no hay datos iniciales, muestra el error
  if (error && (!initialRoomData || Object.keys(initialRoomData).length === 0)) return <div className="py-10"><ErrorMessage message={error} /></div>;
  // Si no está cargando y aún no hay datos iniciales (poco probable si no hubo error, pero como fallback)
  if (!initialRoomData && !isLoading) return <div className="py-10"><ErrorMessage message="No se pudo cargar la habitación para editar." /></div>;


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        to="/rooms" 
        className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 group text-sm font-medium"
      >
        <FaArrowLeft className="mr-2 h-3 w-3 transform group-hover:-translate-x-0.5 transition-transform" />
        Cancelar y volver a habitaciones
      </Link>
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Editar Habitación</h1>
        
        {error && !isSubmitting && <div className="mb-6"><ErrorMessage message={error} /></div>} {/* Mostrar error solo si no es de un submit en curso */}
        
        {/* Renderiza el formulario solo si hay datos iniciales (initialRoomData no es null) */}
        {initialRoomData && (
          <RoomForm
            initialData={stableInitialData} // Pasamos el objeto estable
            onSubmit={handleUpdateRoom}
            isSubmitting={isSubmitting}
            submitButtonText="Actualizar Habitación"
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default EditRoomPage;