import React from 'react';
// Ya no necesitamos FaBars/FaTimes aquí si el toggle está en el Sidebar
// FaUniversity se movió al Sidebar para el logo principal

// Header ya no necesita props relacionadas con el sidebar
function Header() { 
  return (
    // Header es ahora parte del flujo normal de la columna derecha
    // flex-shrink-0 evita que se encoja si el contenido de <main> es muy grande
    // z-10 o z-20 para asegurar que esté sobre el contenido de <main> si hay elementos superpuestos accidentalmente
    <header className="bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-lg h-20 flex-shrink-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full"> {/* container y padding para el contenido del header */}
        <div className="flex items-center justify-between h-full">          
          <div>
            {/* Puedes tener un título de página aquí, o breadcrumbs, etc. */}
            {/* Por ejemplo, un título de la página actual que cambie dinámicamente */}
            {/* <span className="text-xl font-semibold">Dashboard</span> */}
          </div>
          
          <nav className="hidden md:flex space-x-8 items-center">
            {/* Tus enlaces de navegación del header si los tienes */}
            {/* Ejemplo: <a href="#" className="hover:text-sky-200">Mi Perfil</a> */}
            {/* Ejemplo: <button className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md text-sm">Logout</button> */}
          </nav>
          
          <div className="md:hidden">
            {/* Botón de hamburguesa para el menú móvil (para enlaces del header) */}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;