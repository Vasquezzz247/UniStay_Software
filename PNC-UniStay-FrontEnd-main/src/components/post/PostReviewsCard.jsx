// src/components/post/PostReviewsCard.jsx

import React, { useEffect, useState } from 'react';
import {
    FaStar,
    FaRegStar,
    FaChevronLeft,
    FaChevronRight,
    FaRegCommentDots,
} from 'react-icons/fa';
import { getReviewsForPost, createReview } from '../../services/reviewService';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

// Helper: iniciales para avatar
const getInitials = (nameOrEmail) => {
    if (!nameOrEmail) return '??';
    const clean = nameOrEmail.split('@')[0];
    const parts = clean.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
};

// Estrellas “estáticas” (para promedio y reseñas)
const StarsDisplay = ({ value }) => {
    const rounded = Math.round(value || 0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) =>
                i <= rounded ? (
                    <FaStar key={i} className="text-sky-500 h-4 w-4" />
                ) : (
                    <FaRegStar key={i} className="text-sky-300 h-4 w-4" />
                ),
            )}
        </div>
    );
};

// Estrellas “interactivas” para el formulario
const StarsInput = ({ value, onChange, disabled }) => {
    const [hover, setHover] = useState(0);
    const current = hover || value || 0;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => {
                const filled = i <= current;
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={disabled}
                        onClick={() => !disabled && onChange(i)}
                        onMouseEnter={() => !disabled && setHover(i)}
                        onMouseLeave={() => !disabled && setHover(0)}
                        className="p-0.5 disabled:cursor-not-allowed"
                    >
                        {filled ? (
                            <FaStar className="h-5 w-5 text-sky-500" />
                        ) : (
                            <FaRegStar className="h-5 w-5 text-sky-300" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

/**
 * Card de valoraciones + comentarios + formulario
 *
 * Props:
 * - postId: string (UUID del post)
 * - canReview: boolean (si el usuario puede dejar reseña *por rol / lógica del front*)
 */
function PostReviewsCard({ postId, canReview = false }) {
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // formulario nueva reseña
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // flag: backend ya nos dijo que este usuario NO puede reseñar este post
    const [blockedByBackend, setBlockedByBackend] = useState(false);

    // opcional: nombre de usuario
    const [currentUserName, setCurrentUserName] = useState(null);

    // cargar nombre (opcional)
    useEffect(() => {
        try {
            const token = localStorage.getItem('userToken');
            if (!token) return;
            const decoded = jwtDecode(token);
            setCurrentUserName(decoded.name || decoded.sub || decoded.email || null);
        } catch (e) {
            console.warn('No se pudo leer el nombre del usuario desde el token');
        }
    }, []);

    const loadReviews = async () => {
        if (!postId) return;
        try {
            setReviewsLoading(true);
            setReviewsError(null);
            const data = await getReviewsForPost(postId);
            setReviews(data || []);
            setCurrentReviewIndex(0);
        } catch (err) {
            console.error('Error al cargar reseñas:', err);
            setReviewsError('No se pudieron cargar las reseñas.');
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    };

    // cargar reviews al montar / cambiar postId
    useEffect(() => {
        loadReviews();
        setBlockedByBackend(false); // reset si cambiamos de post
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postId]);

    const totalRatings = reviews.length;
    const averageRating = totalRatings
        ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRatings
        : 0;

    const currentReview =
        totalRatings > 0 &&
            currentReviewIndex >= 0 &&
            currentReviewIndex < totalRatings
            ? reviews[currentReviewIndex]
            : null;

    // envío de nueva reseña
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newRating) {
            toast.warn('Selecciona una puntuación antes de enviar.');
            return;
        }

        try {
            setSubmitting(true);
            await createReview({
                postId,
                rating: newRating,
                comment: newComment.trim() || null,
            });
            toast.success('¡Gracias por tu reseña!');
            setNewRating(0);
            setNewComment('');
            await loadReviews();
        } catch (err) {
            console.error('Error al enviar reseña:', err);

            // 🔒 Si el backend responde 403, asumimos que el usuario NO puede reseñar este post
            if (err?.response?.status === 403) {
                setBlockedByBackend(true);
                const msgBackend =
                    err?.response?.data?.message ||
                    'No puedes valorar esta habitación porque aún no has aplicado o no tienes permiso.';
                toast.info(msgBackend);
            } else {
                const msg =
                    err?.response?.data?.message ||
                    err?.message ||
                    'No se pudo enviar la reseña.';
                toast.error(msg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const showForm = canReview && !blockedByBackend;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3">
            {/* Cabecera: promedio */}
            <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-gray-700">Valoraciones</h3>
                {totalRatings > 0 ? (
                    <div className="flex items-center gap-2">
                        <StarsDisplay value={averageRating} />
                        <span className="text-sm font-semibold text-gray-800">
                            {averageRating.toFixed(1)}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-400">Sin valoraciones</span>
                )}
            </div>

            {/* Texto resumen */}
            <p className="text-xs text-gray-500">
                {reviewsLoading
                    ? 'Cargando valoraciones...'
                    : totalRatings === 0
                        ? 'Aún nadie ha calificado esta habitación.'
                        : `${totalRatings} ${totalRatings === 1
                            ? 'persona ha calificado'
                            : 'personas han calificado'
                        } esta habitación.`}
            </p>

            {reviewsError && (
                <p className="text-xs text-red-500">{reviewsError}</p>
            )}

            {/* Slideshow de comentarios */}
            {totalRatings > 0 && currentReview && (
                <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                            Comentarios
                        </h4>

                        <div className="flex items-center gap-1">
                            {currentReviewIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentReviewIndex((idx) => Math.max(idx - 1, 0))
                                    }
                                    className="p-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-xs"
                                >
                                    <FaChevronLeft className="h-3 w-3" />
                                </button>
                            )}

                            <span className="text-[11px] text-gray-500">
                                {currentReviewIndex + 1} / {totalRatings}
                            </span>

                            {currentReviewIndex < totalRatings - 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        setCurrentReviewIndex((idx) =>
                                            Math.min(idx + 1, totalRatings - 1),
                                        )
                                    }
                                    className="p-1 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-xs"
                                >
                                    <FaChevronRight className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 mt-1">
                        <div className="mt-1 h-8 w-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                            {getInitials(
                                currentReview.studentName || currentReview.studentEmail,
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                    {currentReview.studentName ||
                                        currentReview.studentEmail ||
                                        'Usuario'}
                                </p>
                                <div className="flex items-center gap-1 text-xs">
                                    <StarsDisplay value={currentReview.rating || 0} />
                                </div>
                            </div>

                            {currentReview.comment && (
                                <p className="text-xs text-gray-600 mt-1">
                                    {currentReview.comment}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Formulario para dejar reseña */}
            {showForm && (
                <div className="pt-4 border-t border-gray-100 mt-2">
                    <div className="flex items-center gap-2 mb-2">
                        <FaRegCommentDots className="text-sky-500 h-4 w-4" />
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                            Tu reseña
                        </h4>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-gray-600">
                                ¿Qué puntuación le das?
                            </span>
                            <StarsInput
                                value={newRating}
                                onChange={setNewRating}
                                disabled={submitting}
                            />
                        </div>

                        <textarea
                            rows={3}
                            className="w-full text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400 p-2 resize-none"
                            placeholder="Escribe un comentario (opcional)..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={submitting}
                        />

                        <button
                            type="submit"
                            disabled={submitting || !newRating}
                            className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold rounded-lg px-3 py-2 bg-sky-500 text-white hover:bg-sky-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <FaStar className="h-3 w-3" />
                            {submitting ? 'Enviando...' : 'Enviar valoración'}
                        </button>

                        <p className="text-[11px] text-gray-400 mt-1">
                            Solo los estudiantes que hayan alquilado o solicitado una
                            habitación pueden dejar reseñas (el sistema validará tu permiso).
                        </p>
                    </form>
                </div>
            )}

            {/* Mensaje si el front dice que puede reseñar pero el backend lo bloqueó */}
            {canReview && blockedByBackend && (
                <p className="pt-3 border-t border-gray-100 text-[11px] text-gray-400">
                    No tienes permisos para dejar una reseña en esta habitación. Debes
                    haber aplicado o completado un alquiler para poder calificar.
                </p>
            )}
        </div>
    );
}

export default PostReviewsCard;