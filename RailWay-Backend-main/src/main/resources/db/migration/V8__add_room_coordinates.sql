-- V8__add_room_coordinates.sql
-- Agrega columnas de coordenadas a rooms (lat / lng)
-- y asigna un punto cercano a la UCA como valor por defecto.

-- Coordenadas aprox. de la UCA:
-- UCA_LAT = 13.6824
-- UCA_LNG = -89.2360

ALTER TABLE public.rooms
    ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION,
    ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;

-- Asignar coordenadas demo cercanas a la UCA
-- Solo a las filas que aún no tengan lat/lng
UPDATE public.rooms
SET lat = 13.68240,
    lng = -89.23600
WHERE lat IS NULL
   OR lng IS NULL;