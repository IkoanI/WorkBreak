"use client";

import React, {useEffect, useState} from "react";
import FilterForm from '@/app/components/map/FilterForm';
// import Image from "next/image";
// import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/AppContext";
import "./styles.css";
// import {Eye, Star} from "lucide-react";

export interface Restaurant {
  place_id: string;
  name: string;
  photos?: Array<{ getUrl: () => string }>;
  rating?: number;
  price_level?: number;
  types?: string[];
  vicinity?: string;
  formatted_address?: string;
  distance?: string;
}

export default function DiscoverPage() {
  const { googleMapsLibrary } = useAppContext();
  const [coords, setCoords] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (err) => {
        console.error("Error getting location:", err);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  return (
    <div className="discover-page">
      <main className="discover-main">
        <div className="discover-container">
          <h1 className="discover-title">Discover Restaurants</h1>

          {googleMapsLibrary ? (
            <div className="filter-form-wrapper">
              <FilterForm destination={coords}/>
            </div>
          ) : (
            <p>Loading Google Maps library...</p>
          )}
        </div>
      </main>
    </div>
  );
}
