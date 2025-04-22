"use client";

import React, { useEffect, useState} from "react";
import { mapsLibrary, markerLibrary } from "@/app/AppContext";

type Props = {
  destination: { lat: number; lng: number };
};

const containerStyle = {
  width: '100%',
  height: '400px',
};

export default function homeMap({destination} : Props) {

    const mapRef = React.useRef(null);

    useEffect(() => {
        const initMap = async () => {

            const mapOptions: google.maps.MapOptions = {
                center: destination,
                zoom: 15,
                mapId: 'HOME_MAP'
            }

            const map = new mapsLibrary.Map(mapRef.current as unknown as HTMLDivElement, mapOptions);

            const marker = new markerLibrary.AdvancedMarkerElement({
                map: map,
                position: destination,
                title: 'Start Location'
            });
        }

        initMap();
    }, []);

    return (
        <div style={containerStyle} ref={mapRef} />
    )
}