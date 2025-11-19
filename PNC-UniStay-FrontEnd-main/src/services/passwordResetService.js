// src/services/passwordResetService.js
import apiClient from './apiClient';

export async function forgotPassword(email) {
    try {
        const { data } = await apiClient.post('/auth/forgot-password', { email });
        // el backend devuelve { message: "..." }
        return data;
    } catch (error) {
        const backendMsg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'No se pudo enviar el correo de restablecimiento.';
        throw new Error(backendMsg);
    }
}

export async function resetPassword(token, newPassword) {
    try {
        const { data } = await apiClient.post('/auth/reset-password', {
            token,
            newPassword,
        });
        return data;
    } catch (error) {
        const backendMsg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            'No se pudo actualizar la contraseña. El enlace puede estar vencido o ser inválido.';
        throw new Error(backendMsg);
    }
}
