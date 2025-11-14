// src/components/layout/MainLayout.jsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // <-- ¡Importante! Outlet es el marcador de posición para las páginas hijas.
import Sidebar from './Sidebar';

const MainLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const sidebarExpandedMarginClass = "ml-60";
  const sidebarCollapsedMarginClass = "ml-20";
  const mainContentMarginLeftClass = isSidebarCollapsed ? sidebarCollapsedMarginClass : sidebarExpandedMarginClass;

  return (
    <div className="bg-gray-100">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        toggleSidebar={toggleSidebar} 
      />

      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${mainContentMarginLeftClass}`}>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Outlet renderizará aquí el componente de la ruta hija que coincida */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default MainLayout;