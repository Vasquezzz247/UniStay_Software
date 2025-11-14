import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyPayments, confirmPayment } from '../services/paymentService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import EmptyState from '../components/ui/EmptyState';
import PaymentFormModal from '../components/ui/PaymentFormModal'; // <-- 1. Importamos el nuevo modal
import { toast } from 'react-toastify';
import { FaCheckCircle, FaExclamationCircle, FaCreditCard, FaDollarSign } from 'react-icons/fa';

const PaymentCard = ({ payment, onPay }) => {
  const isPaid = payment.status === 'PAID';

  return (
    <div className={`bg-white p-5 rounded-lg border shadow-sm ${isPaid ? 'bg-gray-50' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-500">Pago para la publicación:</p>
          <Link to={`/posts/${payment.postId}`} className="font-bold text-lg text-gray-800 hover:text-sky-600">
            {payment.postTitle || `Post ID: ${payment.postId}`}
          </Link>
        </div>
        {isPaid ? (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-800 flex items-center gap-1">
            <FaCheckCircle /> PAGADO
          </span>
        ) : (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <FaExclamationCircle /> PENDIENTE
          </span>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-dashed flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Monto Total:</p>
          <p className="text-2xl font-bold text-gray-900">${payment.amount?.toFixed(2) || '0.00'}</p>
        </div>
        {!isPaid && (
          <button
            onClick={() => onPay(payment)}
            className="inline-flex items-center gap-2 bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-sky-700"
          >
            <FaCreditCard /> Pagar Ahora
          </button>
        )}
      </div>
    </div>
  );
};


export default function MyPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // --- 2. Cambiamos los estados para manejar el nuevo modal ---
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentToProcess, setPaymentToProcess] = useState(null);

  useEffect(() => {
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    try {
      setLoading(true);
      const response = await getMyPayments();
      setPayments(response.data || []);
    } catch (err) {
      setError(err.message || "Error al cargar tus pagos.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayClick = (payment) => {
    setPaymentToProcess(payment);
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = async () => {
    if (!paymentToProcess) return;
    try {
      await confirmPayment(paymentToProcess.id);
      toast.success("¡Pago realizado exitosamente!");
      fetchMyPayments(); // Recargar la lista
    } catch (err) {
      toast.error(err.message || "Hubo un error al procesar el pago.");
    } finally {
      setShowPaymentModal(false);
      setPaymentToProcess(null);
    }
  };
  
  if (loading) return <div className="h-96 flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <ErrorMessage message={error} />;

  return (
    <>
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Mis Pagos</h1>
        
        {payments.length === 0 ? (
          <EmptyState
              icon={FaDollarSign}
              title="No tienes pagos pendientes"
              message="Cuando un propietario te envíe una solicitud de pago, la verás aquí."
              buttonText="Explorar Publicaciones"
              buttonTo="/posts"
          />
        ) : (
          <div className="space-y-4">
            {payments.map(payment => (
              <PaymentCard key={payment.id} payment={payment} onPay={handlePayClick} />
            ))}
          </div>
        )}
      </div>
      
      {/* --- 3. Renderizamos el nuevo modal de formulario de pago --- */}
      <PaymentFormModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSubmit={handleConfirmPayment}
        paymentDetails={paymentToProcess}
      />
    </>
  );
}