import React, { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaSave } from 'react-icons/fa';
import Map from '../map/Map.jsx'; // Asegúrate de importar el componente de Map que creaste

function RoomForm({
  initialData = {},
  onSubmit,
  isSubmitting,
  submitButtonText = "Guardar Habitación",
  onCancel
}) {
  const [formData, setFormData] = useState(() => {
    return {
      roomId: initialData.roomId || null,
      description: initialData.description || '',
      address: initialData.address || '',
      available: initialData.available === undefined ? true : Boolean(initialData.available),
      squareFootage: initialData.squareFootage || '',
      bathroomType: initialData.bathroomType || 'Compartido',
      kitchenType: initialData.kitchenType || 'Compartida',
      isFurnished: initialData.isFurnished === undefined ? false : Boolean(initialData.isFurnished),
      currentAmenity: '',
      amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
      lat: initialData.lat || 0, // Inicializa con latitud
      lng: initialData.lng || 0, // Inicializa con longitud
    };
  });

  useEffect(() => {
    if (initialData && (Object.keys(initialData).length > 0 || initialData.description || initialData.address)) {
        setFormData({
            roomId: initialData.roomId || null,
            description: initialData.description || '',
            address: initialData.address || '',
            available: initialData.available === undefined ? true : Boolean(initialData.available),
            squareFootage: initialData.squareFootage || '',
            bathroomType: initialData.bathroomType || 'Compartido',
            kitchenType: initialData.kitchenType || 'Compartida',
            isFurnished: initialData.isFurnished === undefined ? false : Boolean(initialData.isFurnished),
            currentAmenity: '',
            amenities: Array.isArray(initialData.amenities) ? initialData.amenities : [],
            lat: initialData.lat || 0,
            lng: initialData.lng || 0,
        });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAmenity = () => {
    const newAmenity = formData.currentAmenity.trim();
    if (newAmenity !== '' && !formData.amenities.includes(newAmenity)) {
      setFormData(prevData => ({
        ...prevData,
        amenities: [...prevData.amenities, newAmenity],
        currentAmenity: '', 
      }));
    } else if (newAmenity !== '') {
        setFormData(prevData => ({ ...prevData, currentAmenity: '' }));
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prevData => ({
      ...prevData,
      amenities: prevData.amenities.filter(amenity => amenity !== amenityToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      roomId: formData.roomId || undefined,
      description: formData.description,
      address: formData.address,
      available: Boolean(formData.available),
      squareFootage: formData.squareFootage ? parseFloat(formData.squareFootage) : 0,
      bathroomType: formData.bathroomType,
      kitchenType: formData.kitchenType,
      isFurnished: Boolean(formData.isFurnished),
      amenities: formData.amenities.filter(amenity => amenity && amenity.trim() !== ''),
      lat: formData.lat, // Asegúrate de enviar latitud
      lng: formData.lng, // Asegúrate de enviar longitud
    };
    if (!dataToSubmit.roomId) {
        delete dataToSubmit.roomId;
    }
    onSubmit(dataToSubmit);
  };

  const labelClass = "block text-sm font-medium text-gray-700 mb-1";
  const inputClass = "block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm";
  const selectClass = `${inputClass} bg-white`;

  const toggleBaseClass = "relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 cursor-pointer";
  const toggleCheckedClass = "bg-sky-600";
  const toggleUncheckedClass = "bg-gray-200";
  const toggleThumbClass = "inline-block w-4 h-4 transform bg-white rounded-full transition-transform";
  const toggleThumbCheckedClass = "translate-x-6";
  const toggleThumbUncheckedClass = "translate-x-1";

  const handleMapClick = (lat, lng) => {
    // Actualizamos las coordenadas en el formulario cuando se hace clic en el mapa
    setFormData(prevData => ({
      ...prevData,
      lat: lat,
      lng: lng,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Información Básica</h2>
        <p className="text-sm text-gray-500 mb-6">Ingrese la información básica sobre la propiedad.</p>

        <div className="space-y-4">
          <div>
            <label htmlFor="description" className={labelClass}>Descripción <span className="text-red-500">*</span></label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" required className={inputClass} placeholder="Describa la habitación, sus características y el ambiente..."></textarea>
          </div>
          <div>
            <label htmlFor="address" className={labelClass}>Dirección <span className="text-red-500">*</span></label>
            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className={inputClass} placeholder="Calle, número, colonia, ciudad..."/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="squareFootage" className={labelClass}>Tamaño (m²) <span className="text-red-500">*</span></label>
              <input type="number" name="squareFootage" id="squareFootage" value={formData.squareFootage} onChange={handleChange} required min="1" className={inputClass} placeholder="15"/>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="bathroomType" className={labelClass}>Tipo de baño <span className="text-red-500">*</span></label>
              <select name="bathroomType" id="bathroomType" value={formData.bathroomType} onChange={handleChange} required className={selectClass}>
                <option value="Compartido">Compartido</option>
                <option value="Privado">Privado</option>
              </select>
            </div>
            <div>
              <label htmlFor="kitchenType" className={labelClass}>Tipo de cocina <span className="text-red-500">*</span></label>
              <select name="kitchenType" id="kitchenType" value={formData.kitchenType} onChange={handleChange} required className={selectClass}>
                <option value="Compartida">Compartida</option>
                <option value="Privada">Privada</option>
                <option value="En la habitación">En la habitación (Kitchenette)</option>
                <option value="Sin acceso">Sin acceso</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Disponible para alquilar <span className="text-red-500">*</span></span>
              <button type="button" onClick={() => setFormData(p => ({...p, available: !p.available}))} className={`${toggleBaseClass} ${formData.available ? toggleCheckedClass : toggleUncheckedClass}`} >
                <span className={`${toggleThumbClass} ${formData.available ? toggleThumbCheckedClass : toggleThumbUncheckedClass}`} />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Amueblado <span className="text-red-500">*</span></span>
              <button type="button" onClick={() => setFormData(p => ({...p, isFurnished: !p.isFurnished}))} className={`${toggleBaseClass} ${formData.isFurnished ? toggleCheckedClass : toggleUncheckedClass}`} >
                <span className={`${toggleThumbClass} ${formData.isFurnished ? toggleThumbCheckedClass : toggleThumbUncheckedClass}`} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="lat" className={labelClass}>Latitud <span className="text-red-500">*</span></label>
            <input type="number" name="lat" id="lat" value={formData.lat} disabled className={inputClass} placeholder="Latitud"/>
          </div>
          <div>
            <label htmlFor="lng" className={labelClass}>Longitud <span className="text-red-500">*</span></label>
            <input type="number" name="lng" id="lng" value={formData.lng} disabled className={inputClass} placeholder="Longitud"/>
          </div>

          <Map
            lat={formData.lat}
            lng={formData.lng}
            onMarkerDragEnd={(e) => {
              setFormData({
                ...formData,
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              });
            }}
            onMapClick={handleMapClick} // Actualiza las coordenadas al hacer clic en el mapa
          />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">Amenidades</h3>
        <p className="text-sm text-gray-500 mb-4">Agregue las comodidades y servicios que ofrece la propiedad.</p>
        <div className="flex items-center mb-3">
          <input 
            type="text" 
            name="currentAmenity"
            value={formData.currentAmenity}
            onChange={handleChange}
            placeholder="Escriba una amenidad y presione '+' o Enter"
            className={`${inputClass} flex-grow mr-2`}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddAmenity();}}}
          />
          <button type="button" onClick={handleAddAmenity} className="bg-slate-700 hover:bg-slate-800 text-white p-2.5 rounded-md shadow-sm flex-shrink-0">
            <FaPlus />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
          {formData.amenities.map((amenity, index) => (
            <span key={index} className="flex items-center bg-sky-100 text-sky-700 text-xs font-medium px-2.5 py-1 rounded-full">
              {amenity}
              <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="ml-1.5 text-sky-500 hover:text-sky-700">
                <FaTimes size=".75em"/>
              </button>
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-200 mt-8">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto inline-flex justify-center py-2.5 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex justify-center items-center py-2.5 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700 disabled:opacity-50"
        >
          <FaSave className="mr-2" />
          {isSubmitting ? 'Guardando...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}

export default RoomForm;
