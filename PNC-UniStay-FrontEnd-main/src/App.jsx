import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout, Rutas y Páginas
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AllPostsPage from './pages/AllPostsPage';
import MyPostsPage from './pages/MyPostsPage';
import PostDetailPage from './pages/PostDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import RoomsPage from './pages/RoomsPage';
import CreateRoomPage from './pages/CreateRoomPage';
import EditRoomPage from './pages/EditRoomPage';
import ReceivedRequests from './pages/ReceivedRequests';
import ScheduleAppointment from './pages/ScheduleAppointment';
import MyApplicationsPage from './pages/MyApplicationsPage';
import MyPaymentsPage from './pages/MyPaymentsPage'; 
import PaymentHistoryPage from './pages/PaymentHistoryPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import SavedPostsPage from './pages/SavedPostsPage';

function App() {
  return (
    <>
      <Routes>
        {/* --- RUTAS PÚBLICAS SIN LAYOUT --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* --- RUTAS PROTEGIDAS DENTRO DEL LAYOUT PRINCIPAL --- */}
        <Route element={<MainLayout />}>
          
          <Route path="/" element={<Navigate to="/posts" replace />} />
          
          {/* Rutas de Publicaciones */}
          <Route path="/posts" element={<ProtectedRoute><AllPostsPage /></ProtectedRoute>} />
          <Route path="/my-posts" element={<ProtectedRoute><MyPostsPage /></ProtectedRoute>} />
          <Route path="/posts/:postId" element={<ProtectedRoute><PostDetailPage /></ProtectedRoute>} />
          <Route path="/posts/new" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
          <Route path="/posts/edit/:postId" element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />
          <Route path="/saved-posts" element={<ProtectedRoute><SavedPostsPage /></ProtectedRoute>} />
          
          {/* Rutas de Habitaciones */}
          <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
          <Route path="/rooms/new" element={<ProtectedRoute><CreateRoomPage /></ProtectedRoute>} />
          <Route path="/rooms/edit/:roomId" element={<ProtectedRoute><EditRoomPage /></ProtectedRoute>} />

          {/* Rutas de Solicitudes/Aplicaciones */}
          <Route path="/requests" element={<ProtectedRoute><ReceivedRequests /></ProtectedRoute>} />
          <Route path="/requests/:id" element={<ProtectedRoute><ScheduleAppointment /></ProtectedRoute>} />
          <Route path="/my-applications" element={<ProtectedRoute><MyApplicationsPage /></ProtectedRoute>} />

          {/* --- RUTA NUEVA PARA PAGOS --- */}
          
          <Route 
            path="/payment-history" 
            element={<ProtectedRoute><PaymentHistoryPage /></ProtectedRoute>}
          />
          
          <Route 
            path="/my-payments" 
            element={<ProtectedRoute><MyPaymentsPage /></ProtectedRoute>} 
          />
          
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
      />
    </>
  );
}

export default App;