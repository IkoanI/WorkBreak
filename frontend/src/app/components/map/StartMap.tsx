"use client";

import React, { useEffect, useState} from "react";
import { Loader } from "@googlemaps/js-api-loader";

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

            const loader = new Loader({
                apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
                version: 'weekly'
            });

            const {Map} = await loader.importLibrary('maps');
            const {AdvancedMarkerElement} = await loader.importLibrary('marker');

            const mapOptions: google.maps.MapOptions = {
                center: destination,
                zoom: 15,
                mapId: 'HOME_MAP'
            }

            const map = new Map(mapRef.current as unknown as HTMLDivElement, mapOptions);

            const marker = new AdvancedMarkerElement({
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