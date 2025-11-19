// src/pages/SavedPostsPage.jsx

import React, { useEffect, useState } from 'react';
import { FaBookmark, FaHome } from 'react-icons/fa';
import { getMyBookmarks } from '../services/bookmarkService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { Link } from 'react-router-dom';

const SavedPostsPage = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError('');
                const data = await getMyBookmarks();
                setSavedPosts(data || []);
            } catch (err) {
                console.error(err);
                setError(err.message || "No se pudieron cargar tus guardados.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const getInitials = (name) => {
        if (!name) return '??';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    if (loading)
        return (
            <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );

    if (error)
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <ErrorMessage message={error} />
            </div>
        );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight flex items-center justify-center gap-2">
                    <FaBookmark className="text-sky-600" />
                    Publicaciones Guardadas
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Aquí puedes ver todas las habitaciones que has guardado como favoritas.
                </p>
            </div>

            {savedPosts.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-xl shadow p-8">
                    <h3 className="text-xl font-semibold text-gray-700">No tienes guardados</h3>
                    <p className="text-gray-500 mt-2">
                        Guarda tus habitaciones favoritas y aparecerán aquí.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    
                    {savedPosts.map((post) => (
                        <div
                            key={post.postId}
                            className="group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300"
                        >
                            {/* Imagen */}
                            <div className="relative">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={
                                            post.imageUrls?.length > 0
                                                ? post.imageUrls[0]
                                                : "https://via.placeholder.com/400x225?text=UniStay"
                                        }
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {post.status === "DISPONIBLE" && (
                                    <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                        Disponible
                                    </span>
                                )}
                            </div>

                            {/* Contenido */}
                            <div className="p-5 flex flex-col flex-grow">
                                <h3 className="font-bold text-lg text-gray-900 truncate">
                                    {post.title}
                                </h3>

                                <p className="flex items-center text-sm text-gray-500 mt-1 truncate">
                                    <FaHome className="mr-2 text-gray-400 flex-shrink-0" />
                                    {post.roomDetails?.address || "Dirección no disponible"}
                                </p>

                                <div className="flex items-center my-4">
                                    <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {getInitials(post.owner)}
                                    </div>
                                    <p className="ml-3 text-sm font-medium text-gray-700">{post.owner}</p>
                                </div>

                                <p className="text-xl font-extrabold text-gray-900">
                                    ${post.price?.toFixed(2)}
                                    <span className="text-sm font-normal text-gray-500"> /month</span>
                                </p>
                            </div>

                            {/* Botón */}
                            <div className="h-20 flex items-center justify-center border-t border-gray-100 px-5">
                                <Link
                                    to={`/posts/${post.postId}`}
                                    className="w-full text-center bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                >
                                    Ver detalles
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default SavedPostsPage;