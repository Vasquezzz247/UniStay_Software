import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/postService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import {
  FaArrowLeft, FaMapMarkerAlt, FaBed, FaBath, FaChair, FaUtensils,
  FaDollarSign, FaTag, FaUserCircle, FaRegCommentDots, FaCalendarCheck, FaFileSignature, FaWifi
} from 'react-icons/fa';
import { MdOutlineVerifiedUser, MdLocalLaundryService, MdOutlineDesk, MdOutlineCleaningServices, MdSquareFoot } from "react-icons/md";
import { jwtDecode } from 'jwt-decode';
import { createInterest } from '../services/interestService';
import { toast } from 'react-toastify';


// Placeholders solo para la estructura de la barra lateral que AÚN NO viene del backend
// o como fallback si algún dato específico no llega.
const staticSidebarPlaceholders = {
  ownerInfo: {
    memberSince: "2023", // Ejemplo
  },
  // LeaseInfo placeholders ahora solo se usarán si los campos específicos no vienen de la API
  leaseInfoFallbacks: {
    minimumTerm: "No especificado",
    maximumLeaseTerm: "No especificado",
    securityDeposit: "No especificado",
  }
};

// Datos de placeholder para el contenido principal si faltan en la API
const mainContentPlaceholders = {
    location: "Dirección no especificada desde API",
    fullPostDescription: "Descripción del post no disponible.",
    roomFeaturesData: [
      { icon: <MdSquareFoot size="1.8em" className="mb-1 text-sky-600"/>, title: "N/A", detail: "Tamaño" },
      { icon: <FaBath size="1.8em" className="mb-1 text-sky-600"/>, title: "N/A", detail: "Baño" },
      { icon: <FaUtensils size="1.8em" className="mb-1 text-sky-600"/>, title: "N/A", detail: "Cocina" },
      { icon: <FaChair size="1.8em" className="mb-1 text-sky-600"/>, title: "N/A", detail: "Amoblado" },
    ],
    amenitiesData: [
      { text: "Consultar amenidades." }
    ]
};


function PostDetailPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);

  // ✅ Detectar rol desde el JWT solo una vez
  const userRole = useMemo(() => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) return null;
      const decoded = jwtDecode(token);
      const roles = decoded.rol || decoded.roles || [];
      return Array.isArray(roles) ? roles.map(r => r.toUpperCase()) : [roles.toUpperCase()];
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!postId) { setError("ID de post no especificado."); setIsLoading(false); return; }
      try {
        setIsLoading(true);
        setError(null);
        const apiPostData = await getPostById(postId); // apiPostData es tu PostResponse
        
        // Combinamos datos de la API. Los campos de Lease Info ahora vienen de apiPostData.
        const enrichedPostData = {
          ...apiPostData, // Datos principales de la API (title, price, status, owner (nombre), imageUrls)
                          // Y ahora también: minimumLeaseTerm, maximumLeaseTerm, securityDeposit
                          // y el objeto roomDetails con squareFootage, bathroomType, etc.

          location: apiPostData.roomDetails?.address || mainContentPlaceholders.location,
          fullDescription: apiPostData.description || apiPostData.roomDetails?.description || mainContentPlaceholders.fullPostDescription,
          
          roomFeatures: (apiPostData.roomDetails?.roomFeatures && apiPostData.roomDetails.roomFeatures.length > 0) 
                        ? apiPostData.roomDetails.roomFeatures 
                        : mainContentPlaceholders.roomFeaturesData,
          amenities: (apiPostData.roomDetails?.amenities && apiPostData.roomDetails.amenities.length > 0) 
                        ? apiPostData.roomDetails.amenities.map(a => ({text: a})) // Asegura que sea [{text: '...'}], si no, ajusta
                        : mainContentPlaceholders.amenitiesData,
          
          // Información del Owner para la sidebar (memberSince es placeholder)
          ownerInfo: { 
            memberSince: apiPostData.ownerInfo?.memberSince || staticSidebarPlaceholders.ownerInfo.memberSince, 
            name: apiPostData.owner // El nombre del owner viene de apiPostData.owner
          },
          // LeaseInfo: Los campos específicos (minimumLeaseTerm, etc.) ya están en apiPostData.
          // No necesitamos fusionar con un objeto leaseInfo de placeholder si los campos están a nivel raíz de apiPostData.
        };
        
        console.log("Datos del post para la página de detalle (enriquecidos):", enrichedPostData);
        setPost(enrichedPostData);

        if (enrichedPostData.imageUrls && enrichedPostData.imageUrls.length > 0) {
          setActiveImage(enrichedPostData.imageUrls[0]);
        } else {
          setActiveImage(`https://picsum.photos/seed/${postId || 'detail_fallback'}/1200/675`);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar detalles de la publicación.');
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPostDetails();
  }, [postId]);

  if (isLoading) return <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="py-10"><ErrorMessage message={error} /></div>;
  if (!post) return <div className="py-10"><ErrorMessage message="Publicación no encontrada o datos incompletos." /></div>;

  const ownerNameForDisplay = post.ownerInfo?.name || "Propietario Desconocido";
  const ownerInitials = ownerNameForDisplay.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();

  const handleCreateInterest = async () => {
  try {
    await createInterest(postId);
    toast.success(' Solicitud enviada con éxito.');
  } catch (err) {
    toast.error(` ${err.message}`);
  }
};

  
  const imageGallery = (post.imageUrls && post.imageUrls.length > 0)
                       ? post.imageUrls
                       : [activeImage || `https://picsum.photos/seed/${postId || 'gallery_placeholder'}/200/112`];

  const roomFeatures = [];
  if (post.roomDetails) {
    if (post.roomDetails.squareFootage) roomFeatures.push({ icon: <MdSquareFoot size="1.8em" className="mb-1 text-sky-600"/>, title: `${post.roomDetails.squareFootage} m²`, detail: "Tamaño" });
    if (post.roomDetails.bathroomType) roomFeatures.push({ icon: <FaBath size="1.8em" className="mb-1 text-sky-600"/>, title: post.roomDetails.bathroomType, detail: "Baño" });
    if (post.roomDetails.kitchenType) roomFeatures.push({ icon: <FaUtensils size="1.8em" className="mb-1 text-sky-600"/>, title: post.roomDetails.kitchenType, detail: "Cocina" });
    if (post.roomDetails.isFurnished !== undefined) roomFeatures.push({ icon: <FaChair size="1.8em" className="mb-1 text-sky-600"/>, title: post.roomDetails.isFurnished ? "Sí" : "No", detail: "Amoblado" });
  } else if (post.roomFeaturesData) { // Fallback a los placeholders si roomDetails no existe pero roomFeaturesData sí
     post.roomFeaturesData.forEach(rf => roomFeatures.push(rf));
  }


  const amenitiesList = (post.amenities && post.amenities.length > 0) 
                        ? post.amenities.map(amenityText => ({ text: amenityText.text || amenityText })) // Maneja si es string o {text: '...'}
                        : [];

  return (
    <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 pt-4 pb-12">

      <div className="lg:grid lg:grid-cols-3 lg:gap-8 xl:gap-12">
        {/* Columna Izquierda */}
        <main className="lg:col-span-2">
          {/* ... (Galería, Título, Precio, Dirección, Descripción del Post, Room Details, Features & Amenities - sin cambios en su JSX, pero ahora usan datos de 'post') ... */}
          {/* Galería de Imágenes */}
          <section className="mb-6">
            <div className="relative mb-2 aspect-[16/9] overflow-hidden rounded-lg shadow-md bg-gray-200">
              <img src={activeImage} alt={`Imagen principal de ${post.title}`} className="absolute inset-0 w-full h-full object-cover" />
              {post.status && (
                <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold rounded-md
                  ${post.status.toLowerCase() === 'disponible' ? 'bg-green-500 text-white' : 
                    'bg-yellow-500 text-black'}`}>
                  {post.status}
                </span>
              )}
            </div>
            {imageGallery.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {imageGallery.map((imgUrl, index) => (
                  <button 
                    key={index} 
                    onClick={() => setActiveImage(imgUrl)} 
                    className={`aspect-video rounded-md overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-sky-500 transition-opacity ${activeImage === imgUrl ? 'ring-2 ring-sky-500 opacity-100' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Título del Post, Precio y Dirección */}
          <section className="pb-6 mb-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
              <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-1 sm:mb-0">{post.title || "Título no disponible"}</h1>
              <div className="text-2xl font-bold text-gray-800 flex-shrink-0 whitespace-nowrap">
                ${parseFloat(post.price || 0).toFixed(2)}
                <span className="text-sm font-normal text-gray-500">/mes</span>
              </div>
            </div>
            {/* Asumiendo que post.location (o post.roomDetails.address) tiene la dirección */}
            {(post.location || post.roomDetails?.address) && (
              <div className="text-sm text-gray-500 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" /> {post.location || post.roomDetails.address}
              </div>
            )}
          </section>

          {/* Descripción del Post */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{post.fullDescription || "Descripción no disponible."}</p>
          </section>

          {/* Room Details */}
          {roomFeatures.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Detalles de la Habitación</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {roomFeatures.map((detail, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg text-center border border-gray-200">
                    <div className="text-sky-600 text-2xl mb-2 mx-auto w-fit">{detail.icon}</div>
                    <p className="text-sm font-medium text-gray-800">{detail.title}</p>
                    <p className="text-xs text-gray-500">{detail.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Features & Amenities */}
          {amenitiesList.length > 0 && (
            <section className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Características y Amenidades</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-gray-700 text-sm">
                {amenitiesList.map((item, index) => (
                  <li key={index} className="flex items-center py-1">
                    {item.icon || <span className="text-green-500 mr-2 text-base">✓</span>}
                    {item.text}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>

        {/* Columna Derecha (Sidebar de Acciones) */}  
        <aside className="lg:col-span-1 space-y-6 mt-10 lg:mt-0">
          {/* Property Owner */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <h3 className="text-md font-semibold text-gray-700 mb-1">Propietario</h3>
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-sky-100 text-sky-600 text-md font-semibold mr-3 border border-sky-200 flex-shrink-0">
                {ownerInitials}
              </div>
              <div>
                <p className="font-semibold text-gray-800 flex items-center">
                  {post.ownerInfo.name}
                  <MdOutlineVerifiedUser className="ml-1.5 text-blue-500 text-md" title="Propietario Verificado" />
                </p>
              </div>
            </div>
          </div>

          {/* Lease Information */}
          {(post.minimumLeaseTerm || post.maximumLeaseTerm || post.securityDeposit != null) && (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-md font-semibold text-gray-700 mb-3">Información del Alquiler</h3>
              <ul className="space-y-1.5 text-xs">
                {post.minimumLeaseTerm && (
                  <li className="flex justify-between text-gray-600">
                    <span>Plazo mínimo:</span>
                    <span className="font-medium text-gray-800">{post.minimumLeaseTerm}</span>
                  </li>
                )}
                {post.maximumLeaseTerm && (
                  <li className="flex justify-between text-gray-600">
                    <span>Plazo máximo:</span>
                    <span className="font-medium text-gray-800">{post.maximumLeaseTerm}</span>
                  </li>
                )}
                {(post.securityDeposit !== null && post.securityDeposit !== undefined) && (
                  <li className="flex justify-between text-gray-600">
                    <span>Depósito:</span>
                    <span className="font-medium text-gray-800">${parseFloat(post.securityDeposit).toFixed(2)}</span>
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Actions Card según rol */}
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-3 sticky top-24">
            {userRole?.includes('ROLE_PROPIETARIO') && (
              <button className="w-full bg-sky-500 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-sky-600 transition-colors text-sm">
                <FaCalendarCheck className="inline mr-2" />Agendar Visita
              </button>
            )}
            {(userRole?.includes('ROLE_ESTUDIANTE') || userRole?.includes('ROLE_PROPIETARIO')) && (
              <button
                onClick={handleCreateInterest}
                className="w-full text-sky-600 py-2.5 px-4 rounded-lg font-semibold border-2 border-sky-500 hover:bg-sky-50 transition-colors text-sm"
              >
                <FaFileSignature className="inline mr-2" />Aplicar Ahora
              </button>
            )}

          </div>
        </aside>
      </div>
    </div>
  );
}

export default PostDetailPage;