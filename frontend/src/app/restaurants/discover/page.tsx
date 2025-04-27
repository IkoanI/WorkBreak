"use client";

import { useEffect, useState } from "react";
import FilterForm from "@/app/components/map/FilterForm";
import { useAppContext } from "@/app/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Eye } from "lucide-react";
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
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  const handleRestaurantsFound = (results: Restaurant[]) => {
    setRestaurants(results);
    setIsLoading(false);
  };

  const createSlug = (name: string) =>
    name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");

  return (
    <div className="discover-page">
      <main className="discover-main">
        <div className="discover-container">
          <h1 className="discover-title">Discover Restaurants</h1>

          {googleMapsLibrary && (
            <div className="filter-form-wrapper">
              <FilterForm destination={coords} onResultsFound={handleRestaurantsFound} setIsLoading={setIsLoading} />
            </div>
          )}

          <div className="restaurants-section">
            <h2 className="restaurants-heading">Restaurants Near You</h2>
            {isLoading ? (
              <div className="restaurants-grid">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="restaurant-card-loading"></div>
                ))}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="restaurants-empty">
                <p>No restaurants found matching your criteria.</p>
                <p>Try adjusting your filters or search in a different area.</p>
              </div>
            ) : (
              <div className="restaurants-grid">
                {restaurants.map((restaurant) => {
                  const slug = createSlug(restaurant.name);
                  const photoUrl = restaurant.photos?.[0]?.getUrl() || "/placeholder.svg?height=200&width=400";
                  const cuisine =
                    restaurant.types?.find(
                      (type) => !["point_of_interest", "establishment", "food", "restaurant"].includes(type)
                    ) || "Restaurant";

                  return (
                    <div key={restaurant.place_id} className="restaurant-card">
                      <div className="restaurant-image-wrapper">
                        <Image
                          src={photoUrl}
                          alt={restaurant.name}
                          fill
                          className="restaurant-image"
                        />
                      </div>

                      <div className="restaurant-info">
                        <h3 className="restaurant-name">{restaurant.name}</h3>
                        <div className="restaurant-rating">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              fill={i < Math.floor(restaurant.rating || 0) ? "currentColor" : "none"}
                              className={i < Math.floor(restaurant.rating || 0) ? "star-filled" : "star-empty"}
                            />
                          ))}
                          <span className="rating-number">{restaurant.rating?.toFixed(1) || "N/A"}</span>
                        </div>
                        <p className="restaurant-cuisine">{cuisine}</p>
                        <p className="restaurant-price-distance">
                          {"$".repeat(restaurant.price_level || 0)} • {restaurant.distance || ""}
                        </p>
                        <p className="restaurant-location">{restaurant.vicinity || restaurant.formatted_address || ""}</p>
                      </div>

                      <div className="restaurant-view-button-wrapper">
                        <button
                          onClick={() => router.push(`/restaurants/${slug}?id=${restaurant.place_id}`)}
                          className="restaurant-view-button"
                          aria-label={`View details for ${restaurant.name}`}
                        >
                          <Eye size={16} className="mr-2" />
                          View
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
