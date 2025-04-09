'use client';
import { useEffect, useState } from 'react';
import {
  useJsApiLoader,
} from '@react-google-maps/api';

// pass restaurant location to map destination
type Props = {
  destination: { lat: number; lng: number };
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

const center = {
    // default center to atlanta
  lat: 33.7490,
  lng: -84.3880,
};

export default function RouteMap({ destination }: Props) {
    // load the google maps api
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });
  

  // hold map instance
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // get directions
  // get directions once map + api are ready
useEffect(() => {
  if (!isLoaded || !map) return;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      map.setCenter(userLocation); // center the map to user

      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      directionsService.route(
        {
          origin: userLocation,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK' && result) {
            directionsRenderer.setDirections(result);
          } else {
            console.error('Directions request failed due to ', status);
          }
        }
      );
    },
    (error) => {
      console.error('Geolocation failed:', error);
    }
  );
}, [isLoaded, map, destination]);

  // error handling
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    // render the map
    <div style={containerStyle} ref={(ref) => {
      if (ref && !map) {
        const googleMap = new google.maps.Map(ref, {
          center,
          zoom: 12,
        });
        setMap(googleMap);
      }
    }} />
  );
}

