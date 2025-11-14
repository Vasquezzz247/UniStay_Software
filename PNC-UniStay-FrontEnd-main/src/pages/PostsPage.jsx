// src/pages/PostsPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts, deletePost } from '../services/postService';
import PostCard from '../components/post/PostCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import ConfirmModal from '../components/ui/ConfirmModal';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext'; // <-- 1. Importamos el hook de autenticación

function PostsPage() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDeletePostModal, setShowDeletePostModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // --- 2. OBTENEMOS EL USUARIO Y DETERMINAMOS SU ROL ---
    const { user } = useAuth();
    const isStudent = user?.roles?.includes('ROLE_ESTUDIANTE');

    useEffect(() => {
        loadPostsData();
    }, []);

    const loadPostsData = async () => {
        // ... (la lógica de carga se mantiene igual) ...
        try {
            setIsLoading(true);
            setError(null);
            const fetchedPosts = await getAllPosts();
            setPosts(fetchedPosts);
        } catch (err) {
            console.error("Error al cargar los posts en PostsPage:", err);
            setError(err.message || 'Ocurrió un error desconocido al obtener las publicaciones.');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNewPost = () => {
        navigate('/posts/new'); 
    };

    const openDeletePostConfirmModal = (post) => {
        setPostToDelete({ id: post.postId || post.id, title: post.title });
        setShowDeletePostModal(true);
    };

    const closeDeletePostConfirmModal = () => {
        setShowDeletePostModal(false);
        setPostToDelete(null);
    };

    const handleConfirmDeletePost = async () => {
        // ... (la lógica de borrado se mantiene igual) ...
        if (!postToDelete) return;
        try {
            const response = await deletePost(postToDelete.id);
            toast.success(response.message || "Publicación eliminada exitosamente.");
            setPosts(prevPosts => prevPosts.filter(p => (p.postId || p.id) !== postToDelete.id));
        } catch (err) {
            toast.error(err.message || "Error al eliminar la publicación.");
        } finally {
            closeDeletePostConfirmModal();
        }
    };

    if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
    if (error && (!Array.isArray(posts) || posts.length === 0)) return <div className="py-10"><ErrorMessage message={error} /></div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800">Explora Nuestras Publicaciones</h2>
            </div>

            {error && <div className="mb-4"><ErrorMessage message={`Error al actualizar la lista: ${error}`} /></div>}

            {(!isLoading && posts.length === 0 && !error) ? (
                <div className="text-center py-10 bg-white rounded-xl shadow p-8">
                    {/* ... (el resto del JSX se mantiene igual) ... */}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {posts.map(post => (
                        <PostCard 
                            key={post.postId || post.id} 
                            post={post} 
                            onOpenDeleteConfirm={() => openDeletePostConfirmModal(post)} 
                        />
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={showDeletePostModal}
                onClose={closeDeletePostConfirmModal}
                onConfirm={handleConfirmDeletePost}
                message={`¿Estás seguro de que quieres eliminar la publicación "${postToDelete?.title || ''}"? Esta acción no se puede deshacer.`}
                confirmText="Sí, eliminar"
                icon={FaTrash}
            />
        </div>
    );
}

export default PostsPage;
