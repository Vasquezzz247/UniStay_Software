import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map = ({ lat, lng, onMarkerDragEnd, onMapClick }) => {
  // Coordenadas predeterminadas para San Salvador
  const defaultCenter = { lat: 13.6923, lng: -89.2182 };

  const [mapCenter, setMapCenter] = useState({ lat: lat || defaultCenter.lat, lng: lng || defaultCenter.lng });

  useEffect(() => {
    if (lat && lng) {
      setMapCenter({ lat, lng });
    }
  }, [lat, lng]);

  const handleMapClick = (e) => {
    const newLat = e.latLng.lat();
    const newLng = e.latLng.lng();
    setMapCenter({ lat: newLat, lng: newLng }); // Actualiza la ubicación del marcador
    onMapClick(newLat, newLng); // Llama a la función `onMapClick` pasada como prop
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={14}
        onClick={handleMapClick}  // Al hacer clic en el mapa
      >
        <Marker 
          position={mapCenter}
          draggable={true}
          onDragEnd={(e) => onMarkerDragEnd(e)} // Llamar a la función onMarkerDragEnd cuando el marcador se arrastra
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
