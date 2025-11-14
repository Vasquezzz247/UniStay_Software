// src/components/post/PostCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegBuilding, FaUserCircle, FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // <-- 1. Importamos el hook de autenticación

function PostCard({ post, onOpenDeleteConfirm }) { 
  const navigate = useNavigate();
  // --- 2. OBTENEMOS EL USUARIO Y DETERMINAMOS SU ROL ---
  const { user } = useAuth();
  const isStudent = user?.roles?.includes('ROLE_ESTUDIANTE');

  // --- TU LÓGICA ORIGINAL (COMPLETA) ---
  let displayImageUrl = `https://picsum.photos/seed/${post.postId || 'default_card_seed'}/600/337`;
  if (post.imageUrls && post.imageUrls.length > 0) {
    displayImageUrl = post.imageUrls[0];
  }

  const title = post.title || 'Título no disponible';
  const price = parseFloat(post.price || 0).toFixed(2);
  const status = post.status || 'N/A';
  const ownerDisplay = post.owner || 'Propietario no especificado';
  const roomDisplay = post.room || 'Detalles de habitación no especificados';
  const postId = post.postId || post.id;

  const ownerInitials = ownerDisplay
    .split(' ')
    .map(name => name[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const cardBaseClass = "bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out flex flex-col overflow-hidden group h-full";

  const handleViewDetailsClick = () => {
    if (postId) navigate(`/posts/${postId}`);
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); 
    if (postId) navigate(`/posts/edit/${postId}`);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (!postId) {
      console.error("PostCard: postId no definido, no se puede solicitar eliminación.");
      return;
    }
    onOpenDeleteConfirm(post); 
  };

  return (
    <div className={cardBaseClass}>
      <div className="relative w-full cursor-pointer" style={{ paddingBottom: '56.25%' }} onClick={handleViewDetailsClick}>
        <img 
            src={displayImageUrl} 
            alt={`Imagen de ${title}`} 
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://via.placeholder.com/600x337/CCCCCC/FFFFFF?text=Imagen+no+disponible`;
            }}
        />
        {status && (
          <div className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-xs font-semibold rounded-md shadow-sm
                          ${status.toLowerCase() === 'disponible' ? 'bg-green-100 text-green-700' :
                            status.toLowerCase() === 'alquilado' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-gray-200 text-gray-700'}`}>
            {status}
          </div>
        )}
         
         {/* --- 3. RENDERIZADO CONDICIONAL BASADO EN EL ROL --- */}
         {/* Solo mostramos los botones si el usuario NO es estudiante */}
         {!isStudent && (
            <div className="absolute top-2.5 right-2.5 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                <button 
                  onClick={handleEditClick}
                  title="Editar Publicación"
                  className="p-2 bg-black/60 hover:bg-black/80 text-white rounded-full shadow-md"
                  aria-label="Editar Publicación"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={handleDeleteClick}
                  title="Eliminar Publicación"
                  className="p-2 bg-red-600/70 hover:bg-red-700 text-white rounded-full shadow-md"
                  aria-label="Eliminar Publicación"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </button>
            </div>
         )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-md font-semibold text-gray-800 mb-1 truncate cursor-pointer hover:text-sky-600" title={title} onClick={handleViewDetailsClick}>
          {title}
        </h2>
        
        <p className="text-xs text-gray-600 mb-2 flex items-center min-h-[2rem]"> 
          <FaRegBuilding className="mr-1.5 text-gray-500 flex-shrink-0" />
          <span className="truncate">{roomDisplay}</span>
        </p>

        <div className="flex items-center mb-3">
          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-sky-500 text-white text-xs font-semibold mr-2 flex-shrink-0">
            {ownerInitials || <FaUserCircle />}
          </div>
          <p className="text-xs text-gray-700 truncate">{ownerDisplay}</p>
        </div>

        <div className="mt-auto border-t border-gray-100 pt-3"> 
          <p className="text-xl font-bold text-gray-900">
            ${price}
            <span className="text-xs font-normal text-gray-500"> /mes</span>
          </p>
        </div>

        <div className="mt-3 h-10 flex items-end opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform translate-y-1 transition-all duration-300 ease-in-out">
          <button 
            className="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-3 rounded-md transition-colors text-xs flex items-center justify-center"
            onClick={handleViewDetailsClick}
          >
            <FaEye className="mr-2"/> View Details
          </button>
        </div>
      </div>
    </div>
  );
}
export default PostCard;
