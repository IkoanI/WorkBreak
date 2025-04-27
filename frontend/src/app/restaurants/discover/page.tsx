"use client";

import { useEffect, useState } from "react";
import FilterForm from "@/app/components/map/FilterForm";
import { useAppContext } from "@/app/AppContext";
import "./styles.css";

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
  const [, setRestaurants] = useState<Restaurant[]>([]);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
        setIsLoading(false);
      },
      (err) => {
        console.error("Error getting location:", err);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, []);

  const handleRestaurantsFound = (results: Restaurant[]) => {
    setRestaurants(results);
  };

  return (
    <div className="discover-page">
      <main className="discover-main">
        <div className="discover-container">
          <h1 className="discover-title">Discover Restaurants</h1>

          {googleMapsLibrary ? (
            <div className="filter-form-wrapper">
              <FilterForm
                destination={coords}
                onResultsFound={handleRestaurantsFound}
                setIsLoading={setIsLoading}
              />
            </div>
          ) : (
            <p>Loading Google Maps library...</p>
          )}
        </div>
      </main>
    </div>
  );
}
