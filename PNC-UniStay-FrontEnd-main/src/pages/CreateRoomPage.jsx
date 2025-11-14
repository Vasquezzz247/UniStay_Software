import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import RoomForm from '../components/room/RoomForm'; // Asegúrate que la ruta sea correcta
import { createRoom } from '../services/roomService'; // Asegúrate que la ruta sea correcta
import { toast } from 'react-toastify'; // Usando react-toastify

function CreateRoomPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialRoomData = useMemo(() => ({
    description: '',
    address: '',
    available: true, 
    squareFootage: '', 
    bathroomType: 'Compartido',
    kitchenType: 'Compartida',
    isFurnished: false,
    amenities: [], 
    lat: 0, // Latitud inicial, puedes cambiar este valor si tienes alguna latitud por defecto
    lng: 0, // Longitud inicial, puedes cambiar este valor si tienes alguna longitud por defecto
  }), []);

  const handleCreateRoom = async (formData) => {
    setIsSubmitting(true);
    // setError(null); 

    console.log("Enviando datos de habitación para crear:", formData); 

    try {
      const response = await createRoom(formData);
      console.log("Habitación creada:", response);
      
      toast.success(response.message || '¡Habitación creada exitosamente!');

      // --- REDIRECCIÓN MODIFICADA ---
      // Ahora siempre redirige a la lista de habitaciones después de crear
      navigate('/rooms'); 
      // ------------------------------

    } catch (err) {
      console.error("Error al crear la habitación:", err);
      toast.error(err.message || 'Ocurrió un error al crear la habitación.');
      // setError(err.message || 'Ocurrió un error al crear la habitación.'); // Opcional
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/rooms'); // O a la página principal de listado de posts, o a un dashboard de propietario
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl border border-gray-200">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Nueva Propiedad</h1>
          <p className="text-sm text-gray-500 mt-1">Complete el formulario para registrar una nueva habitación en UniStay.</p>
        </div>
      

        <RoomForm 
          initialData={initialRoomData} 
          onSubmit={handleCreateRoom} 
          isSubmitting={isSubmitting}
          submitButtonText="Guardar Propiedad"
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default CreateRoomPage;