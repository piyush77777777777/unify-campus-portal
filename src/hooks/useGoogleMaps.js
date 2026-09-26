// src/hooks/useGoogleMaps.js
// Shared loader — loads Maps API once, used by all map components
import { useJsApiLoader } from '@react-google-maps/api';

const LIBRARIES = ['places', 'geometry'];

export const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const MAPS_ENABLED  = MAPS_API_KEY.startsWith('AIza');

// UNIFY campus center (IGIT Sarang, Odisha — adjust to your college)
export const CAMPUS_CENTER = { lat: 20.9517, lng: 85.1004 };

export function useGoogleMaps() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: MAPS_API_KEY,
    libraries: LIBRARIES,
    id: 'unify-google-maps',
  });
  return { isLoaded: MAPS_ENABLED && isLoaded, loadError, mapsEnabled: MAPS_ENABLED };
}