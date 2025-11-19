// src/pages/ForgotPasswordPage.jsx

import React, { useState } from 'react';
import AuthLayout from '../components/layout/AuthLayout';
import { Mail, ArrowRight } from 'lucide-react';
import { forgotPassword } from '../services/passwordResetService';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusMessage('');
        setIsSubmitting(true);

        try {
            await forgotPassword(email);
            // Da igual si el email existe o no: mensaje genérico
            setStatusMessage(
                'Si el correo existe en nuestro sistema, te enviaremos un enlace para restablecer tu contraseña.'
            );
        } catch (err) {
            setError(
                err.message ||
                'Ocurrió un problema al intentar enviar el correo de restablecimiento.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout
            title="¿Olvidaste tu contraseña?"
            subtitle="Te enviaremos un enlace para que puedas crear una nueva."
        >
            <div className="p-8 border border-gray-200 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    Restablecer contraseña
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Ingresa el correo con el que te registraste en UniStay.
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
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2 px-4 py-2.5 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                    >
                        {isSubmitting ? 'Enviando...' : 'Enviar enlace'}{' '}
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿Recordaste tu contraseña?{' '}
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

export default ForgotPasswordPage;
