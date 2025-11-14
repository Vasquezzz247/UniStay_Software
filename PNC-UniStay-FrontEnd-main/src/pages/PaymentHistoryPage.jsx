// src/pages/PaymentHistoryPage.jsx

import React, { useState, useEffect } from 'react';
import { getPaymentsByOwner, makePaymentRequest, regeneratePayment } from '../services/paymentService';
import { getAcceptedRequestsForOwner } from '../services/interestService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { toast } from 'react-toastify';
import { FaUser, FaBuilding, FaDollarSign, FaClock, FaCheckCircle, FaCreditCard, FaRegFileAlt } from 'react-icons/fa';

// --- Tarjeta de Acuerdo (sin cambios) ---
const AgreementCard = ({ request, onGenerate }) => (
    <div className="bg-white p-5 rounded-lg border shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-3 mb-2">
                <FaUser className="text-sky-600"/>
                <span className="font-bold text-gray-800">{request.studentName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                <FaBuilding className="text-gray-400"/>
                <span>{request.postTitle}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
                 <FaClock className="text-gray-400"/>
                 <span>Cita confirmada para: {new Date(request.appointmentDateTime).toLocaleString()}</span>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-end">
            <button 
                onClick={() => onGenerate(request.id)}
                className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-sky-700 focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors"
            >
                <FaCreditCard />
                Generar Solicitud de Pago
            </button>
        </div>
    </div>
);


// --- Tarjeta de Historial de Pagos (con el botón MEJORADO) ---
const PaymentHistoryCard = ({ payment, onRegenerate }) => {
    const statusStyles = {
        PAID: {
            icon: <FaCheckCircle className="text-green-500" />,
            bgColor: 'bg-green-50',
            textColor: 'text-green-700',
            text: 'Pagado'
        },
        UNPAID: {
            icon: <FaClock className="text-yellow-500" />,
            bgColor: 'bg-yellow-50',
            textColor: 'text-yellow-700',
            text: 'Pendiente'
        },
    };

    const currentStatus = statusStyles[payment.status] || statusStyles['UNPAID'];

    return (
        <div className="bg-white p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-shadow hover:shadow-md">
            <div className="flex items-center gap-4">
                <div className="hidden sm:block bg-slate-100 p-3 rounded-full">
                    <FaDollarSign className="text-slate-500 h-5 w-5" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{payment.postTitle}</p>
                    <p className="text-sm text-gray-500">
                        Para: <span className="font-medium text-gray-700">{payment.studentName || 'Estudiante'}</span> - Monto: ${payment.amount?.toFixed(2) || '0.00'}
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 self-end sm:self-center">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${currentStatus.bgColor} ${currentStatus.textColor}`}>
                    {currentStatus.icon}
                    <span>{currentStatus.text}</span>
                </div>
                
                {/* ================================================================= */}
                {/* ---               AQUÍ ESTÁ EL NUEVO BOTÓN MEJORADO           --- */}
                {/* ================================================================= */}
                {payment.status === 'PAID' && (
                    <button
                        onClick={() => onRegenerate(payment.id)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                        <FaCreditCard className="h-3 w-3" />
                        <span>Regenerar</span>
                    </button>
                )}
            </div>
        </div>
    );
};


// --- Componente Principal de la Página (Sin cambios lógicos) ---
export default function PaymentHistoryPage() {
    const [agreements, setAgreements] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [agreementsRes, paymentsRes] = await Promise.all([
                getAcceptedRequestsForOwner(),
                getPaymentsByOwner()
            ]);
            
            setAgreements(agreementsRes.data || []);
            setPayments(paymentsRes.data || []);

        } catch(err) {
            const errorMessage = err?.response?.data?.message || err.message || "Error al cargar los datos.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleGeneratePayment = async (interestId) => {
        try {
            await makePaymentRequest(interestId);
            toast.success("Solicitud de pago generada exitosamente.");
            fetchData(); 
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "Error al generar la solicitud.";
            toast.error(errorMessage);
        }
    };

    const handleRegeneratePayment = async (previousPaymentId) => {
        try {
            await regeneratePayment(previousPaymentId);
            toast.success("Nueva solicitud de pago generada exitosamente.");
            fetchData();
        } catch (err) {
            const errorMessage = err?.response?.data?.message || err.message || "Error al generar el nuevo pago.";
            toast.error(errorMessage);
        }
    };

    if (loading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner/></div>;
    if (error) return <div className="p-4"><ErrorMessage message={error} /></div>;

    return (
        <div className="bg-slate-50 min-h-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Pagos y Alquileres</h1>
                
                <section className="mb-16">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Acuerdos Listos para Pago</h2>
                    {agreements.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {agreements.map(req => <AgreementCard key={req.id} request={req} onGenerate={handleGeneratePayment} />)}
                        </div>
                    ) : (
                        <div className="text-center bg-white border rounded-lg p-8">
                            <FaRegFileAlt className="mx-auto text-4xl text-gray-300 mb-4"/>
                            <h3 className="font-semibold text-gray-700">Todo en orden</h3>
                            <p className="text-sm text-gray-500 mt-1">No tienes citas confirmadas pendientes de generar pago.</p>
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Historial de Pagos Generados</h2>
                    {payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map(p => (
                                <PaymentHistoryCard 
                                    key={p.id} 
                                    payment={p} 
                                    onRegenerate={handleRegeneratePayment} 
                                />
                            ))}
                        </div>
                    ) : (
                         <div className="text-center bg-white border rounded-lg p-8">
                            <FaDollarSign className="mx-auto text-4xl text-gray-300 mb-4"/>
                            <h3 className="font-semibold text-gray-700">Sin historial todavía</h3>
                            <p className="text-sm text-gray-500 mt-1">No has generado ninguna solicitud de pago.</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}