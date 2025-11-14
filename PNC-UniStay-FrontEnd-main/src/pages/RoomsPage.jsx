// src/pages/RoomsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaExclamationCircle } from 'react-icons/fa';
import { getMyRooms, deleteRoom } from '../services/roomService';
import RoomCard from '../components/room/RoomCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ConfirmModal from '../components/ui/ConfirmModal';
import { toast } from 'react-toastify';

function RoomsPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  useEffect(() => {
    loadRoomsData();
  }, []);

  const loadRoomsData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // --- CORRECCIÓN CLAVE AQUÍ ---
      // La API devuelve un objeto { message, status, data: [...] }
      // Nos aseguramos de extraer solo el array 'data'.
      const response = await getMyRooms();
      setRooms(response.data || []); // Usamos response.data, que contiene el array de habitaciones
    } catch (err) {
      console.error("Error al cargar las habitaciones del propietario en RoomsPage:", err);
      setError(err.message || 'Ocurrió un error desconocido al obtener tus habitaciones.');
      setRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewRoom = () => {
    navigate('/rooms/new');
  };

  const openDeleteConfirmModal = (room) => {
    setRoomToDelete({ id: room.roomId || room.id, description: room.description }); 
    setShowDeleteModal(true);
  };

  const closeDeleteConfirmModal = () => {
    setShowDeleteModal(false);
    setRoomToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!roomToDelete) return;
    try {
      const response = await deleteRoom(roomToDelete.id);
      toast.success(response.message || "Habitación eliminada exitosamente.");
      setRooms(prevRooms => prevRooms.filter(room => (room.roomId || room.id) !== roomToDelete.id));
    } catch (err) {
      toast.error(err.message || "Error al eliminar la habitación.");
    } finally {
      closeDeleteConfirmModal();
    }
  };
  
  if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  if (error && (!Array.isArray(rooms) || rooms.length === 0) ) return <div className="py-10"><ErrorMessage message={error} /></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Mis Habitaciones</h1>
      </div>

      {error && <div className="mb-4"><ErrorMessage message={`Error al actualizar la lista: ${error}`} /></div>}

      {(!isLoading && rooms.length === 0 && !error) ? (
        <div className="text-center py-10 bg-white rounded-xl shadow p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 10.173A5.96 5.96 0 015.25 6H3.75v10.5A2.25 2.25 0 006 18.75h10.5a2.25 2.25 0 002.25-2.25V6H13.8a5.96 5.96 0 01-4.05 4.173zM9.75 10.173V15m5.25-4.827A5.966 5.966 0 0118.75 6H20.25v10.5A2.25 2.25 0 0118 18.75H7.5a2.25 2.25 0 01-2.25-2.25V6H6.75c.946 0 1.818.313 2.532.841M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes habitaciones registradas</h3>
          <p className="mt-1 text-sm text-gray-500">¡Comienza por añadir tu primera habitación para poder publicarla!</p>
          <div className="mt-6">
            <button
              onClick={handleCreateNewRoom}
              type="button"
              className="inline-flex items-center rounded-md bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-500"
            >
              <FaPlus className="-ml-0.5 mr-1.5 h-5 w-5" />
              Registrar Primera Habitación
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rooms.map(room => (
            <RoomCard 
              key={room.roomId || room.id} 
              room={room} 
              onOpenDeleteConfirm={() => openDeleteConfirmModal(room)} 
            />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={closeDeleteConfirmModal}
        onConfirm={handleConfirmDelete}
        message="¿Estás seguro de que quieres eliminar esta habitación? Esta acción no se puede deshacer." 
        confirmText="Sí, eliminar"
        cancelText="No, cancelar"
        icon={FaExclamationCircle} 
      />
    </div>
  );
}

export default RoomsPage;
