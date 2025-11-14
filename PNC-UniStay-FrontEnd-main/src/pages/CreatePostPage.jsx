import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PostForm from '../components/post/PostForm';
import { createPost } from '../services/postService';
import { getMyRooms } from '../services/roomService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import { FaBuilding } from 'react-icons/fa';
import habitacionDefault from '../assets/images/habitacion.jpg'; //  Importa la imagen por defecto

function CreatePostPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownerRooms, setOwnerRooms] = useState([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await getMyRooms();
        const roomsData = response.data || [];
        setOwnerRooms(roomsData);
      } catch (err) {
        setError(err.message || "No se pudieron cargar tus habitaciones.");
      } finally {
        setIsLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCreatePost = async (postMetadata, files) => {
    setIsSubmitting(true);
    setError(null);

    const formDataPayload = new FormData();
    formDataPayload.append(
      'postData', 
      new Blob([JSON.stringify(postMetadata)], { type: "application/json" })
    );

    try {
      if (!files || files.length === 0) {
        const response = await fetch(habitacionDefault);
        const blob = await response.blob();
        const defaultFile = new File([blob], 'habitacion.jpg', { type: blob.type });
        formDataPayload.append('images', defaultFile);
      } else {
        files.forEach(file => {
          formDataPayload.append('images', file);
        });
      }

      const response = await createPost(formDataPayload);
      toast.success(response.message || '¡Publicación creada exitosamente!');
      navigate('/my-posts');
    } catch (err) {
      toast.error(err.message || 'Ocurrió un error al crear la publicación.');
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/posts');
  };

  if (isLoadingRooms) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl border border-gray-200">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Crear Nueva Publicación</h1>
          <p className="text-sm text-gray-500 mt-1">Completa el formulario para anunciar una habitación.</p>
        </div>

        {ownerRooms.length === 0 ? (
           <EmptyState 
             icon={FaBuilding}
             title="Primero necesitas una habitación"
             message="Para poder crear una publicación, primero debes registrar una de tus habitaciones."
             buttonText="Crear Primera Habitación"
             buttonTo="/rooms/new"
           />
        ) : (
          <PostForm 
            ownerRooms={ownerRooms}
            onSubmit={handleCreatePost} 
            isSubmitting={isSubmitting}
            submitButtonText="Publicar Anuncio"
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
}

export default CreatePostPage;
