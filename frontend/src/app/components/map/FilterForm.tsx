"use client";

import { useState } from "react";
import SearchTiles from "@/app/components/map/SearchTiles";
import { useAppContext } from "@/app/AppContext";
import "./style.css";

type Props = {
  destination: { lat: number; lng: number };
};

type FormData = {
  searchQuery: string;
  cuisine: string;
  distance: string;
  budget: string;
};

const cuisineOptions = [
  "Chinese", "Italian", "American", "Mexican", 
  "Indian", "Japanese", "Thai", "Mediterranean", "French", "Greek", "Vietnamese"
];

export default function FilterForm({ destination }: Props) {
  const { user, googleMapsLibrary } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    searchQuery: "",
    cuisine: user.cuisines.length > 0 ? user.cuisines[0] : "",
    distance: "1",
    budget: "MODERATE",
  });

  const [isSearching, setIsSearching] = useState(false);

  const onFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
  };

  if (!googleMapsLibrary) return null;

  return (
    <div>
      <form className="filter-form" onSubmit={onFinish}>
        <div className="form-group">
          {/* Search by Name Bar */}
          <div className="form-item">
            <label>Search Restaurant</label>
            <input
              type="text"
              name="searchQuery"
              placeholder="Enter restaurant name..."
              value={formData.searchQuery}
              onChange={(e) => setFormData({ ...formData, searchQuery: e.target.value })}
            />
          </div>

          {/* Cuisine Dropdown */}
          <div className="form-item">
            <label>Cuisine</label>
            <select
              name="cuisine"
              required
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
            >
              <option value="">Select Cuisine</option>
              {cuisineOptions.map((cuisine) => (
                <option key={cuisine} value={cuisine.toLowerCase()}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          {/* Distance Input */}
          <div className="form-item">
            <label>Distance (miles)</label>
            <input
              type="number"
              name="distance"
              min="0.5"
              step="0.1"
              required
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
            />
          </div>

          {/* Budget Dropdown */}
          <div className="form-item">
            <label>Budget</label>
            <select
              name="budget"
              required
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            >
              <option value="">Select Budget</option>
              <option value={googleMapsLibrary.priceLevel.INEXPENSIVE}>Inexpensive</option>
              <option value={googleMapsLibrary.priceLevel.MODERATE}>Moderate</option>
              <option value={googleMapsLibrary.priceLevel.EXPENSIVE}>Expensive</option>
              <option value={googleMapsLibrary.priceLevel.VERY_EXPENSIVE}>Very Expensive</option>
            </select>
          </div>
        </div>

        <div className="form-submit">
          <button type="submit" className="submit-button">
            Search
          </button>
        </div>
      </form>

      {/* Load SearchTiles after search */}
      {isSearching && (
        <div style={{ marginTop: "2rem" }}>
          <SearchTiles position={destination} formData={formData} />
        </div>
      )}
    </div>
  );
}
