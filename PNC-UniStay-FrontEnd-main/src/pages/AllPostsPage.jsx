// src/pages/AllPostsPage.jsx (o donde tengas este componente)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllPosts } from '../services/postService';
import { filterPosts } from '../services/postFilterService'; // 👈 IMPORTANTE
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { FaHome } from 'react-icons/fa';
import PostFiltersBar from '../components/post/PostFiltersBar'; // 👈 NUEVO IMPORT

const ReadOnlyPostCard = ({ post }) => {
    const getInitials = (name) => {
        if (!name) return '??';
        const nameParts = name.split(' ');
        if (nameParts.length > 1) {
            return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="group bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative">
                <div className="aspect-w-16 aspect-h-9">
                    <img 
                        src={post.imageUrls && post.imageUrls.length > 0 ? post.imageUrls[0] : 'https://via.placeholder.com/400x225?text=UniStay'} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                {post.status === 'DISPONIBLE' && (
                    <span className="absolute top-3 right-3 bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">Available</span>
                )}
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="font-bold text-lg text-gray-900 truncate" title={post.title}>{post.title}</h3>
                
                <p className="flex items-center text-sm text-gray-500 mt-1 truncate" title={post.roomDetails?.address}>
                    <FaHome className="mr-2 text-gray-400 flex-shrink-0" />
                    {post.roomDetails?.address || 'Dirección no disponible'}
                </p>
                
                <div className="flex items-center my-4">
                    <div className="flex-shrink-0 h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(post.owner)}
                    </div>
                    <p className="ml-3 text-sm font-medium text-gray-700">{post.owner}</p>
                </div>
                
                <p className="text-xl font-extrabold text-gray-900">
                    ${typeof post.price === 'number' ? post.price.toFixed(2) : '0.00'}
                    <span className="text-sm font-normal text-gray-500"> /month</span>
                </p>
            </div>

            <div className="h-20 flex items-center justify-center border-t border-gray-100 px-5">
                <Link 
                    to={`/posts/${post.postId}`} 
                    className="w-full text-center bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                    aria-label={`View details for ${post.title}`}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

function AllPostsPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        maxDistanceKm: '',
    });

    // Carga inicial (sin filtros)
    const loadAllPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const postsData = await getAllPosts();
            setPosts(postsData || []);
        } catch (err) {
            console.error("Error al cargar los posts en AllPostsPage:", err);
            setError(err.message || 'Ocurrió un error al obtener las publicaciones.');
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAllPosts();
    }, []);

    // Aplicar filtros
    const handleApplyFilters = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Convertimos strings a números o undefined
            const payload = {
                minPrice: filters.minPrice !== '' ? Number(filters.minPrice) : undefined,
                maxPrice: filters.maxPrice !== '' ? Number(filters.maxPrice) : undefined,
                maxDistanceKm: filters.maxDistanceKm !== '' ? Number(filters.maxDistanceKm) : undefined,
            };

            const filtered = await filterPosts(payload);
            setPosts(filtered || []);
        } catch (err) {
            console.error("Error al filtrar posts:", err);
            setError(err.message || 'Ocurrió un error al filtrar las publicaciones.');
        } finally {
            setIsLoading(false);
        }
    };

    // Limpiar filtros
    const handleClearFilters = async () => {
        setFilters({
            minPrice: '',
            maxPrice: '',
            maxDistanceKm: '',
        });
        await loadAllPosts();
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-10">
                <ErrorMessage message={error} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                    Explora Nuestras Publicaciones
                </h1>
                <p className="mt-2 text-lg text-gray-600">
                    Encuentra la habitación perfecta para tu próxima estancia.
                </p>
            </div>

            {/* 🔍 BARRA DE FILTROS */}
            <PostFiltersBar
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />

            {posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {posts.map((post) => (
                        <ReadOnlyPostCard
                            key={post.postId || post.id}
                            post={post}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl shadow p-8">
                    <h3 className="text-xl font-semibold text-gray-700">No hay publicaciones</h3>
                    <p className="text-gray-500 mt-2">
                        Aún no hay nada por aquí. ¡Vuelve a intentarlo más tarde!
                    </p>
                </div>
            )}
        </div>
    );
}

export default AllPostsPage;