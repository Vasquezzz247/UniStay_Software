// src/pages/ResetPasswordPage.jsx

import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../components/layout/AuthLayout';
import { Lock, ArrowRight } from 'lucide-react';
import { resetPassword } from '../services/passwordResetService';

const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [newPassword, setNewPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    if (!token) {
        return (
            <AuthLayout
                title="Enlace inválido"
                subtitle="El enlace para restablecer la contraseña no es válido."
            >
                <div className="p-8 border border-gray-200 rounded-xl shadow-sm text-center">
                    <p className="text-sm text-gray-600 mb-4">
                        El enlace que has abierto no contiene un token válido. Es posible que
                        esté incompleto o haya expirado.
                    </p>
                    <Link
                        to="/forgot-password"
                        className="inline-flex items-center px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                        Solicitar un nuevo enlace
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (newPassword !== confirm) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword(token, newPassword);
            setStatusMessage('Tu contraseña se ha actualizado correctamente.');

            // Pequeño delay opcional y luego redirigir a login
            setTimeout(() => {
                navigate('/login', {
                    state: {
                        message: 'Tu contraseña fue actualizada. Ya puedes iniciar sesión.',
                    },
                });
            }, 1200);
        } catch (err) {
            setError(
                err.message ||
                'No se pudo actualizar la contraseña. El enlace puede estar vencido o ser inválido.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="Crear nueva contraseña"
            subtitle="Ingresa una nueva contraseña para tu cuenta UniStay."
        >
            <div className="p-8 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    Restablecer contraseña
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Asegúrate de elegir una contraseña segura que recuerdes.
                </p>

                {statusMessage && (
                    <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">
                        {statusMessage}
                    </div>
                )}

                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nueva contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nueva contraseña"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Confirmar contraseña
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Repite la contraseña"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Guardando...' : 'Actualizar contraseña'}{' '}
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿Ya recuerdas tu contraseña?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Volver al inicio de sesión
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
};

export default ResetPasswordPage;