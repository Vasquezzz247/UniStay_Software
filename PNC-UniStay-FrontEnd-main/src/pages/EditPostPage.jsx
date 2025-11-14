import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PostForm from '../components/post/PostForm'; // Reutilizamos PostForm
import { getPostById, updatePost } from '../services/postService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { toast } from 'react-toastify';

function EditPostPage() {
  const { postId } = useParams(); 
  const navigate = useNavigate();
  
  const [initialPostDataForForm, setInitialPostDataForForm] = useState(null); 
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!postId) {
      toast.error("ID de publicación no encontrado para editar.");
      navigate("/posts");
      return;
    }
    const fetchPostData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const dataFromApi = await getPostById(postId); // dataFromApi es tu PostResponse
        console.log("EditPostPage - Datos recibidos de getPostById:", dataFromApi); // DEBUG: Verifica esta salida

        // Preparamos los datos para PostForm.
        // PostForm espera 'existingImageUrls' y los campos de alquiler en su prop 'initialData'.
        setInitialPostDataForForm({
          postId: dataFromApi.postId,
          title: dataFromApi.title || '',
          price: dataFromApi.price !== undefined ? dataFromApi.price.toString() : '',
          status: dataFromApi.status || 'Disponible',
          owner: dataFromApi.owner || '', // Asume que PostResponse.owner es el ID string o nombre
          room: dataFromApi.room || '',   // Asume que PostResponse.room es el ID string o descripción
          existingImageUrls: dataFromApi.imageUrls || [], // Pasa las URLs de imágenes existentes
          // Incluir los campos de alquiler que ahora son parte de PostResponse
          minimumLeaseTerm: dataFromApi.minimumLeaseTerm || '',
          maximumLeaseTerm: dataFromApi.maximumLeaseTerm || '',
          securityDeposit: dataFromApi.securityDeposit !== undefined && dataFromApi.securityDeposit !== null 
                           ? dataFromApi.securityDeposit.toString() 
                           : '',
        });
      } catch (err) {
        const errorMessage = err.message || "Error al cargar datos de la publicación para editar.";
        toast.error(errorMessage);
        setError(errorMessage);
        setInitialPostDataForForm({}); // Fallback para que el form no falle si hay error de carga
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostData();
  }, [postId, navigate]);

  // Memoizamos initialData para que PostForm no se re-renderice innecesariamente
  const stableInitialDataForForm = useMemo(() => initialPostDataForForm || { 
      postId: null, title: '', price: '', status: 'Disponible', owner: '', room: '', 
      minimumLeaseTerm: '', maximumLeaseTerm: '', securityDeposit: '',
      existingImageUrls: [],
  }, [initialPostDataForForm]);


  const handleUpdatePost = async (postMetadata, newFiles) => {
    setIsSubmitting(true);
    setError(null);

    const formDataPayload = new FormData();
    formDataPayload.append('postData', new Blob([JSON.stringify(postMetadata)], { type: "application/json" }));

    if (newFiles && newFiles.length > 0) {
      newFiles.forEach((file, index) => {
        formDataPayload.append('newImages', file, file.name || `new_image-${index}`);
      });
    }
    // Si PostForm envía 'imagesToDelete' en postMetadata, el backend debe manejarlo.
    // Ejemplo: if (postMetadata.imagesToDelete && postMetadata.imagesToDelete.length > 0) {
    //   formDataPayload.append('imagesToDelete', JSON.stringify(postMetadata.imagesToDelete));
    // }

    try {
      const response = await updatePost(postId, formDataPayload); 
      toast.success(response.message || '¡Publicación actualizada exitosamente!');
      navigate(`/posts/${postId}`); 
    } catch (err) {
      toast.error(err.message || 'Ocurrió un error al actualizar la publicación.');
      setError(err.message || 'Ocurrió un error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/posts/${postId}`); 
  };

  if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  if (error && (!initialPostDataForForm || Object.keys(initialPostDataForForm).length === 0 && !initialPostDataForForm.postId)) return <div className="py-10"><ErrorMessage message={error} /></div>;
  if (!initialPostDataForForm && !isLoading) return <div className="py-10"><ErrorMessage message="No se pudieron cargar los datos para editar." /></div>;


  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        to={`/posts/${postId}`} 
        className="inline-flex items-center text-sky-600 hover:text-sky-700 mb-6 group text-sm font-medium"
      >
        <FaArrowLeft className="mr-2 h-3 w-3 transform group-hover:-translate-x-0.5 transition-transform" />
        Cancelar Edición y Volver al Detalle
      </Link>
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-xl border border-gray-200">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4">Editar Publicación</h1>
        
        {error && !isSubmitting && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                <strong>Error:</strong> {error}
            </div>
        )}
        

        {initialPostDataForForm && initialPostDataForForm.postId && (
          <PostForm 
            initialData={stableInitialDataForForm}
            onSubmit={handleUpdatePost} 
            isSubmitting={isSubmitting}
            submitButtonText="Actualizar Publicación"
            onCancel={handleCancel}
            isEditing={true} 
          />
        )}
      </div>
    </div>
  );
}

export default EditPostPage;
