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
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
    libraries: ['places'],
  });

  // hold map instance
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // get directions
  useEffect(() => {
    if (!isLoaded || !map) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        // TODO; make this dynamic (adjust to user loc)
        origin: 'Atlanta, GA', 
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

