"use client";
import { useState } from "react";
import SearchTiles from "@/app/components/map/SearchTiles";
import { useAppContext } from "@/app/AppContext";

type Restaurant = {
  place_id: string;
  name: string;
  photos?: Array<{ getUrl: () => string }>;
  rating?: number;
  price_level?: number;
  types?: string[];
  vicinity?: string;
  formatted_address?: string;
  distance?: string;
};

const formStyle = {
  backgroundColor: "tan",
};


type Props = {
  destination: { lat: number; lng: number };
  onResultsFound?: (results: Restaurant[]) => void; 
  setIsLoading?: (loading: boolean) => void;
};

type FormData = {
  cuisine: string;
  distance: string;
  budget: string;
};

export default function FilterForm({
  destination,
  onResultsFound,
  setIsLoading,
}: Props) {
  const { user, googleMapsLibrary } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    cuisine: user.cuisines.join(" or "),
    distance: "1",
    budget: "MODERATE",
  });
  const [isLoading, setLocalIsLoading] = useState(false);

  const onFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalIsLoading(true);
    if (setIsLoading) setIsLoading(true);

    // We manually call SearchTiles-like logic here
    // (In your real project SearchTiles is doing a nearby search with Maps API)
    // Here, just trigger onResultsFound if available
    if (onResultsFound) {
      onResultsFound([]); // TEMP: replace [] later with real search result if needed
    }

    setLocalIsLoading(false);
    if (setIsLoading) setIsLoading(false);
  };

  if (!googleMapsLibrary) return null;

  return (
    <div>
      <form style={formStyle} onSubmit={onFinish}>
        <div className="form-group">
          <div className="form-item">
            <label htmlFor="cuisine">Cuisine</label>
            <input
              name="cuisine"
              value={formData.cuisine}
              onChange={(event) =>
                setFormData({ ...formData, cuisine: event.target.value })
              }
            />
          </div>

          <div className="form-item">
            <label htmlFor="distance">Distance</label>
            <input
              required
              name="distance"
              type="number"
              value={formData.distance}
              onChange={(event) =>
                setFormData({ ...formData, distance: event.target.value })
              }
            />
          </div>

          <div className="form-item">
            <label htmlFor="budget">Budget</label>
            <select
              required
              name="budget"
              value={formData.budget}
              onChange={(event) =>
                setFormData({ ...formData, budget: event.target.value })
              }
            >
              <option value="">Select</option>
              <option value={googleMapsLibrary.priceLevel.INEXPENSIVE}>
                Inexpensive
              </option>
              <option value={googleMapsLibrary.priceLevel.MODERATE}>
                Moderate
              </option>
              <option value={googleMapsLibrary.priceLevel.EXPENSIVE}>
                Expensive
              </option>
              <option value={googleMapsLibrary.priceLevel.VERY_EXPENSIVE}>
                Very Expensive
              </option>
            </select>
          </div>
        </div>

        <div>
          <button disabled={isLoading} className="add-button" type="submit">
            Submit
          </button>
        </div>
      </form>

      {/* You still keep this like you originally had */}
      <div>
        <SearchTiles position={destination} formData={formData} />
      </div>
    </div>
  );
}
