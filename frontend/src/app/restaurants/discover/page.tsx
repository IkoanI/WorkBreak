"use client";

import React, {useEffect, useState} from "react";
import FilterForm from '@/app/components/map/FilterForm';
import {useAppContext} from "@/app/AppContext";
import TripadvisorReviews from "@/app/components/tripadvisor/TripadvisorReviews";

export default function DiscoverPage() {
    const {googleMapsLibrary} = useAppContext();
    const [coords, setCoords] = useState({lat: 0, lng: 0});

    useEffect(() => {
        const getPosition = async () => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        const success = (position: GeolocationPosition) => {
            setCoords({lat: position.coords.latitude, lng: position.coords.longitude});
        };

        if (!window.navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        window.navigator.geolocation.getCurrentPosition(success, null, options);
    };

    getPosition();
    }, []);

    return (
        <div>
            <div>
                <TripadvisorReviews restaurant_name={"Papa Johns Pizza"} coords={{lat: 33.781551, lng: -84.399268}}/>
                {googleMapsLibrary && <FilterForm destination={coords}/>}
            </div>
        </div>
    );
}