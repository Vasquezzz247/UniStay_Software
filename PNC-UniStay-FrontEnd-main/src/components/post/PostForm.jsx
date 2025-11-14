import React, { useState, useEffect } from 'react';
import { FaSave, FaTimes, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';

function PostForm({
  ownerRooms = [],
  initialData = {},
  onSubmit,
  isSubmitting,
  submitButtonText = "Guardar Publicación",
  onCancel,
  isEditing = false // Prop para saber si estamos en modo edición
}) {
  // Inicializamos el estado del formulario
  const [formData, setFormData] = useState({
    postId: initialData.postId || null,
    title: initialData.title || '',
    price: initialData.price !== undefined ? initialData.price.toString() : '',
    status: initialData.status || 'DISPONIBLE',
    roomId: initialData.roomDetails?.roomId || initialData.roomId || '',
    roomDetails: initialData.roomDetails || null, // Para mostrar info en modo edición
    minimumLeaseTerm: initialData.minimumLeaseTerm || '',
    maximumLeaseTerm: initialData.maximumLeaseTerm || '',
    securityDeposit: initialData.securityDeposit !== undefined ? initialData.securityDeposit.toString() : '',
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState(initialData.existingImageUrls || []);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  // Limpia las URLs de previsualización de archivos para evitar fugas de memoria
  useEffect(() => {
    return () => {
      imagePreviews.forEach(fileUrl => URL.revokeObjectURL(fileUrl));
    };
  }, [imagePreviews]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.filter(file => 
      !selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)
    );
    if (newFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    }
    e.target.value = null; // Limpiar el input para permitir seleccionar el mismo archivo de nuevo
  };

  const handleRemoveNewImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveExistingImage = (urlToRemove) => {
    setExistingImageUrls(prevUrls => prevUrls.filter(url => url !== urlToRemove));
    if (!imagesToDelete.includes(urlToRemove)) {
        setImagesToDelete(prevDelete => [...prevDelete, urlToRemove]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing && !formData.roomId) {
      toast.error("Por favor, selecciona una habitación para la publicación.");
      return;
    }
    const postMetadata = {
      ...(formData.postId && { postId: formData.postId }), 
      title: formData.title,
      price: formData.price ? parseFloat(formData.price) : 0.0,
      status: formData.status,
      ...(!isEditing && { roomId: formData.roomId }),
      minimumLeaseTerm: formData.minimumLeaseTerm,
      maximumLeaseTerm: formData.maximumLeaseTerm,
      securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0.0,
      ...(imagesToDelete.length > 0 && { imagesToDelete: imagesToDelete }),
    };
    
    onSubmit(postMetadata, selectedFiles); 
  };

  // Clases de estilos reutilizables de Tailwind
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const selectClass = `${inputClass} appearance-none bg-white`;
  const disabledInputClass = "block w-full px-3 py-2.5 bg-gray-200 border border-gray-300 rounded-md text-gray-600 cursor-not-allowed";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Información del Anuncio</h2>
        <p className="text-sm text-gray-500 mb-6">Detalles principales del anuncio.</p>
        <div className="space-y-4">
          
          <div>
            <label htmlFor="roomId" className={labelClass}>Habitación a Publicar <span className="text-red-500">*</span></label>
            {isEditing ? (
              // En modo edición, mostramos un campo de texto deshabilitado
              <div className={disabledInputClass}>
                {formData.roomDetails?.address || 'Habitación asignada'}
              </div>
            ) : (
              // En modo creación, mostramos el selector con opciones deshabilitadas
              <select name="roomId" id="roomId" value={formData.roomId} onChange={handleChange} required className={selectClass}>
                <option value="" disabled>-- Escoge una de tus habitaciones --</option>
                {Array.isArray(ownerRooms) && ownerRooms.map(room => (
                  <option 
                    key={room.roomId} 
                    value={room.roomId} 
                    disabled={!room.available || room.hasActivePost}
                  >
                    {room.address} 
                    {!room.available && ' (No disponible)'}
                    {room.hasActivePost && ' (Ya publicada)'}
                  </option>
                ))}
              </select>
            )}
            {!isEditing && Array.isArray(ownerRooms) && ownerRooms.length === 0 && (
              <p className="text-xs text-gray-500 mt-1">No tienes habitaciones creadas.</p>
            )}
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>Título del Anuncio <span className="text-red-500">*</span></label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Ej: Habitación luminosa"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className={labelClass}>Precio por Mes ($) <span className="text-red-500">*</span></label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="0.01" className={inputClass} placeholder="300.00"/>
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>Estado del Anuncio <span className="text-red-500">*</span></label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} required className={selectClass}>
                <option value="DISPONIBLE">Disponible</option>
                <option value="ALQUILADO">Alquilado</option>
                <option value="PAUSADO">Pausado</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Condiciones del Alquiler</h2>
        <p className="text-sm text-gray-500 mb-6">Términos del contrato de alquiler.</p>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="minimumLeaseTerm" className={labelClass}>Plazo Mínimo</label>
              <input type="text" name="minimumLeaseTerm" id="minimumLeaseTerm" value={formData.minimumLeaseTerm} onChange={handleChange} className={inputClass} placeholder="Ej: 6 meses"/>
            </div>
            <div>
              <label htmlFor="maximumLeaseTerm" className={labelClass}>Plazo Máximo</label>
              <input type="text" name="maximumLeaseTerm" id="maximumLeaseTerm" value={formData.maximumLeaseTerm} onChange={handleChange} className={inputClass} placeholder="Ej: 1 año, Indefinido"/>
            </div>
          </div>
          <div>
            <label htmlFor="securityDeposit" className={labelClass}>Depósito de Seguridad ($)</label>
            <input type="number" name="securityDeposit" id="securityDeposit" value={formData.securityDeposit} onChange={handleChange} min="0" step="0.01" className={inputClass} placeholder="Ej: 0.00 o 250.00"/>
          </div>
        </div>
      </section>
      
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Imágenes de la Publicación</h2>
        <p className="text-sm text-gray-500 mb-6">Sube nuevas imágenes o gestiona las existentes.</p>
        
        {existingImageUrls.length > 0 && (
          <div className="mb-4">
            <p className={labelClass}>Imágenes actuales:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {existingImageUrls.map((url, index) => (
                <div key={`existing-${url}-${index}`} className="relative group aspect-square">
                  <img src={url} alt={`Imagen existente ${index + 1}`} className="w-full h-full object-cover rounded-md shadow" />
                  <button type="button" onClick={() => handleRemoveExistingImage(url)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md" title="Marcar para eliminar">
                    <FaTimes className="h-2.5 w-2.5"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="images-upload-input" className={labelClass}>Añadir nuevas imágenes:</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <FaUpload className="mx-auto h-10 w-10 text-gray-400" />
              <div className="flex text-sm text-gray-600 justify-center">
                <label htmlFor="images-upload-input" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600">
                  <span>Selecciona archivos</span>
                  <input id="images-upload-input" name="images-upload-input" type="file" className="sr-only" multiple onChange={handleFileChange} accept="image/*" />
                </label>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, WEBP hasta 10MB</p>
            </div>
          </div>
        </div>

        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <p className={labelClass}>Nuevas imágenes a subir ({selectedFiles.length}):</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {imagePreviews.map((previewUrl, index) => (
                <div key={previewUrl} className="relative group aspect-square">
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-md shadow" />
                  <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full shadow-md" title="Quitar imagen">
                    <FaTimes className="h-2.5 w-2.5"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      
      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
        {onCancel && (
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border rounded-md">
            Cancelar
          </button>
        )}
        <button type="submit" disabled={isSubmitting} className="flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gray-800 rounded-md disabled:opacity-50">
          <FaSave className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Guardando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default PostForm;