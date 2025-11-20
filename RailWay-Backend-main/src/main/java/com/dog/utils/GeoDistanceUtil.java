// src/main/java/com/dog/utils/GeoDistanceUtil.java
package com.dog.utils;

public class GeoDistanceUtil {

    private static final double EARTH_RADIUS_KM = 6371.0;

    /**
     * Calcula la distancia entre dos puntos en la Tierra usando la fórmula de Haversine.
     * No lanza excepciones (si entran valores raros solo devolverá un doble).
     */
    public static double distanceInKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }
}