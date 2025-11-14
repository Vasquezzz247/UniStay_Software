import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaMapMarkerAlt, FaBed, FaBath, FaUtensils, FaChair, 
    FaCheckCircle, FaTimesCircle, FaEdit, FaTrash 
} from 'react-icons/fa';

// Cambiamos onRoomDeleted por onOpenDeleteConfirm
function RoomCard({ room, onOpenDeleteConfirm }) { 
  const navigate = useNavigate();
  
  // ... (tus constantes description, address, ownerName, roomId) ...
  const description = room.description || 'Descripción no disponible.';
  const address = room.address || 'Dirección no disponible.';
  const ownerName = room.ownerName || 'Propietario no especificado';
  const roomId = room.roomId || room.id;


  const handleEditClick = () => {
    if (roomId) navigate(`/rooms/edit/${roomId}`);
  };

  // El handleDeleteClick ahora solo llama a la prop onOpenDeleteConfirm
  const handleDeleteClick = () => {
    if (!roomId) {
      console.error("RoomCard: roomId no definido.");
      toast.error("No se pudo obtener el ID de la habitación."); // Puedes usar toast aquí también
      return;
    }
    // Pasamos el objeto room completo para que el padre pueda usar su descripción en el mensaje del modal
    onOpenDeleteConfirm(room); 
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out flex flex-col h-full overflow-hidden">
      <div className="p-5 flex flex-col flex-grow">
        {/* ... (resto del JSX de la tarjeta) ... */}
        <h3 className="text-lg font-semibold text-sky-700 mb-2 truncate" title={description}>
          {description.length > 100 ? `${description.substring(0, 97)}...` : description}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 flex items-start">
          <FaMapMarkerAlt className="mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
          <span>{address}</span>
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
          <span className="flex items-center"><FaBed className="mr-1.5 text-sky-500"/> {room.squareFootage || 'N/A'} m²</span>
          <span className="flex items-center"><FaBath className="mr-1.5 text-sky-500"/> Baño: {room.bathroomType || 'N/A'}</span>
          <span className="flex items-center"><FaUtensils className="mr-1.5 text-sky-500"/> Cocina: {room.kitchenType || 'N/A'}</span>
          <span className="flex items-center">
            {room.isFurnished ? 
              <FaCheckCircle className="mr-1.5 text-green-500"/> : 
              <FaTimesCircle className="mr-1.5 text-red-500"/>}
            Amoblado: {room.isFurnished ? 'Sí' : 'No'}
          </span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-500 mb-1">Amenidades:</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, index) => (
                <span key={index} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                  {amenity}
                </span>
              ))}
              {room.amenities.length > 3 && <span className="text-slate-500 text-xs self-end">...</span>}
            </div>
          </div>
        )}
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-500">
              Propietario: <span className="font-medium text-gray-700">{ownerName}</span>
            </p>
            <p className={`text-xs font-semibold ${room.available ? 'text-green-600' : 'text-red-600'}`}>
              {room.available ? 'Disponible' : 'No Disponible'}
            </p>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={handleEditClick}
              title="Editar Habitación"
              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-md transition-colors"
            >
              <FaEdit className="h-4 w-4" />
            </button>
            <button 
              onClick={handleDeleteClick} // Llama al nuevo manejador
              title="Eliminar Habitación"
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
            >
              <FaTrash className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RoomCard;