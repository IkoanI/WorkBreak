import React, { useEffect, useState } from "react";
import {useAppContext} from "@/app/AppContext";

type Props = {
    placeId : string;
    destination : {lat: number, lng: number};
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function Route(data : Props) {
    const { googleMapsLibrary } = useAppContext();


    // the map instance //
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const userLocation = {
                    lat: 0,
                    lng: 0,
    }

    useEffect(() => {
        if (!map || !googleMapsLibrary) {
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position : GeolocationPosition) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                map.setCenter(userLocation);

                const directionsService = new googleMapsLibrary.routesLibrary.DirectionsService();
                const directionsRenderer = new googleMapsLibrary.routesLibrary.DirectionsRenderer();

                directionsRenderer.setMap(map);
                directionsService.route(
                    {
                        origin: userLocation,
                        destination: {placeId : data.placeId},
                        travelMode: google.maps.TravelMode.DRIVING,
                        optimizeWaypoints: true,
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
                console.log('Geolocation failed:', error);
            }
        );
    }, [map]);

    return (
    // render the map
    <div style={containerStyle} ref={(ref) => {
      if (ref && !map) {
        const googleMap = new google.maps.Map(ref, {
          center: userLocation,
          zoom: 12,
        });
        setMap(googleMap);
      }
    }} />
  );
}