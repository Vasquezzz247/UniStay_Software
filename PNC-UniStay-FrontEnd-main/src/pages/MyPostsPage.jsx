import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyPosts, deletePost } from '../services/postService';
import { FaEdit, FaTrash, FaPlus, FaPlusSquare } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState'; // Importamos el componente

const MyPostCard = ({ post, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <Link to={`/posts/${post.postId}`} className="block group">
      <div className="aspect-w-16 aspect-h-9">
        <img 
          src={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : 'https://via.placeholder.com/400x225?text=Sin+Imagen'} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{post.title}</h3>
        <p className="text-sm text-gray-600">{post.roomDetails?.address}</p>
        <p className="text-xl font-semibold text-sky-600 mt-2">${post.price.toFixed(2)}</p>
      </div>
    </Link>
    <div className="mt-auto p-4 bg-gray-50 border-t flex justify-end gap-3">
      <Link to={`/posts/edit/${post.postId}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
        <FaEdit /> Editar
      </Link>
      <button onClick={() => onDelete(post.postId)} className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
        <FaTrash /> Eliminar
      </button>
    </div>
  </div>
);

function MyPostsPage() {
  const [myPosts, setMyPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMyPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getMyPosts();
      setMyPosts(response.data || []);
    } catch (err) {
      const errorMessage = err.message || 'Ocurrió un error inesperado al cargar tus publicaciones.';
      setError(errorMessage);
      if (err.status === 401 || err.status === 403) {
          toast.warn("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión de nuevo.");
          navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.')) {
      try {
        await deletePost(postId);
        toast.success('Publicación eliminada exitosamente.');
        fetchMyPosts();
      } catch (err) {
        toast.error(err.message || 'Error al eliminar la publicación.');
      }
    }
  };

  if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Mis Publicaciones</h1>
      </div>

      {myPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {myPosts.map(post => (
            <MyPostCard key={post.postId} post={post} onDelete={handleDeletePost} />
          ))}
        </div>
      ) : (
        <EmptyState 
          icon={FaPlusSquare}
          title="Aún no tienes publicaciones"
          message="¡Comienza por crear tu primera publicación para que otros puedan ver tus habitaciones!"
          buttonText="Crear Primera Publicación"
          buttonTo="/posts/new"
        />
      )}
    </div>
  );
}

export default MyPostsPage;