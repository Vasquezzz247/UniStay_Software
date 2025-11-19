// src/components/layout/Sidebar.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FaGlobe,
  FaClipboardList,
  FaPlusSquare,
  FaBuilding,
  FaPlusCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUniversity,
  FaSignOutAlt,
  FaUserCircle,
  FaRegCommentDots,
  FaPaperPlane,
  FaCreditCard,
  FaDollarSign,
  FaBookmark,          // 👈 NUEVO
} from 'react-icons/fa';

// --- DATOS DE NAVEGACIÓN CORREGIDOS ---
const navSectionsData = [
  {
    title: "Publicaciones",
    links: [
      { to: "/posts", label: "Explorar Posts", icon: FaGlobe, role: 'all', end: true },
      { to: "/saved-posts", label: "Guardados", icon: FaBookmark, role: 'all' }, // 👈 NUEVO
      { to: "/my-applications", label: "Mis Aplicaciones", icon: FaPaperPlane, role: 'student' },
      { to: "/my-posts", label: "Mis Posts", icon: FaClipboardList, role: 'owner' },
      { to: "/posts/new", label: "Crear Post", icon: FaPlusSquare, role: 'owner' }
    ]
  },
  {
    title: "Habitaciones",
    links: [
      { to: "/rooms", label: "Ver Habitaciones", icon: FaBuilding, role: 'owner', end: true },
      { to: "/rooms/new", label: "Crear Habitación", icon: FaPlusCircle, role: 'owner' }
    ]
  },
  {
    title: "Gestión",
    links: [
      { to: "/requests", label: "Solicitudes Recibidas", icon: FaRegCommentDots, role: 'owner' },
      { to: "/payment-history", label: "Pagos y Alquileres", icon: FaDollarSign, role: 'owner' },
      { to: "/my-payments", label: "Mis Pagos", icon: FaCreditCard, role: 'student' }
    ]
  }
];

function Sidebar({ isCollapsed, toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const isStudent = user?.roles?.includes('ROLE_ESTUDIANTE');

  const linkStyles = {
    base: "flex items-center w-full p-3 my-1 rounded-lg transition-colors duration-200",
    active: "bg-sky-600 text-white",
    inactive: "text-gray-600 hover:bg-gray-100",
  };

  const textAnimation = `whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-0 ml-0 opacity-0' : 'w-auto ml-3 opacity-100'}`;

  return (
    <aside
      className={`bg-white shadow-lg fixed top-0 left-0 h-screen z-30 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-60'}`}
    >
      <header className="flex items-center border-b border-gray-200 h-20 flex-shrink-0 px-4">
        <div
          className={`flex items-center cursor-pointer w-full ${isCollapsed ? 'justify-center' : ''}`}
          onClick={() => navigate('/')}
        >
          <FaUniversity className="h-8 w-8 text-sky-700 flex-shrink-0" />
          <span className={`text-xl font-bold text-sky-700 ${textAnimation}`}>
            UniStay
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 absolute top-[72px] -right-4 bg-white border border-gray-300"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <FaChevronRight className="h-4 w-4 text-gray-700" />
          ) : (
            <FaChevronLeft className="h-4 w-4 text-gray-700" />
          )}
        </button>
      </header>

      <nav className="flex-grow py-4 space-y-4 overflow-y-auto overflow-x-hidden px-3">
        {navSectionsData.map((section) => {
          const visibleLinks = section.links.filter(link => {
            if (link.role === 'all') return true;
            if (isStudent && link.role === 'student') return true;
            if (!isStudent && link.role === 'owner') return true;
            return false;
          });

          if (visibleLinks.length === 0) {
            return null;
          }

          return (
            <div key={section.title}>
              <h3
                className={`px-2 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider overflow-hidden transition-opacity duration-200 ${
                  isCollapsed ? 'opacity-0' : 'opacity-100'
                }`}
              >
                {section.title}
              </h3>
              {visibleLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `${linkStyles.base} ${isCollapsed ? 'justify-center' : ''} ${
                      isActive ? linkStyles.active : linkStyles.inactive
                    }`
                  }
                  title={isCollapsed ? link.label : ''}
                >
                  <link.icon className="h-5 w-5 flex-shrink-0" />
                  <span className={textAnimation}>
                    {link.label}
                  </span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <footer className="p-3 border-t border-gray-200">
        {user && (
          <div
            className={`flex items-center p-2 mb-2 rounded-md bg-gray-50 overflow-hidden ${
              isCollapsed ? 'justify-center' : ''
            }`}
          >
            <FaUserCircle className="h-8 w-8 text-gray-400 flex-shrink-0" />
            <div className={textAnimation}>
              <p className="text-sm font-semibold text-gray-800 truncate">Bienvenido,</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`${linkStyles.base} text-red-600 hover:bg-red-100 ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title="Cerrar Sesión"
        >
          <FaSignOutAlt className="h-5 w-5 flex-shrink-0" />
          <span className={textAnimation}>
            Cerrar Sesión
          </span>
        </button>
      </footer>
    </aside>
  );
}

export default Sidebar;