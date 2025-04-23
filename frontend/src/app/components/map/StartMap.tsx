"use client";

import React, { useEffect } from "react";
import {useAppContext} from "@/app/AppContext";

type Props = {
  destination: { lat: number; lng: number };
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function HomeMap({destination} : Props) {
    const {googleMapsLibrary} = useAppContext();
    
    const mapRef = React.useRef(null);

    useEffect(() => {
        const initMap = async () => {
            
            if (!googleMapsLibrary) return;

            const mapOptions: google.maps.MapOptions = {
                center: destination,
                zoom: 15,
                mapId: 'HOME_MAP'
            }

            const map = new googleMapsLibrary.mapsLibrary.Map(mapRef.current as unknown as HTMLDivElement, mapOptions);

            const marker = new googleMapsLibrary.markerLibrary.AdvancedMarkerElement({
                map: map,
                position: destination,
                title: 'Start Location'
            });
        }

        initMap();
    }, [destination, googleMapsLibrary]);

    return (
        <div style={containerStyle} ref={mapRef} />
    )
}