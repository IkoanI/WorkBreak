"use client";

import React from "react";
import FilterForm from '@/app/components/map/FilterForm';
import StartMap from '@/app/components/map/StartMap';

export default function finderPage() {

    let coords = {
        lat: 0,
        lng: 0,
    };

    let getPosition = async () => {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        let success = (pos: { coords: any; }) => {
            coords.lat = pos.coords.latitude;
            coords.lng = pos.coords.longitude;
        };

        if (!window.navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        window.navigator.geolocation.getCurrentPosition(success, null, options);
    };

    getPosition();

    return (
        <div>
            <div>
                <FilterForm />
            </div>
            <div>
                <StartMap destination={coords} />
            </div>
        </div>
    );
}