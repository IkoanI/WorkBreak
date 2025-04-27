"use client";

import React, { useEffect, useState } from "react";
import Latlon from "geodesy/latlon-ellipsoidal-vincenty";
import "../../globals.css";
import Place = google.maps.places.Place;
import { useAppContext } from "@/app/AppContext";
import { useRouter } from "next/navigation"; 

type Props = {
  position: { lat: number; lng: number };
  formData: { cuisine: string; distance: string; budget: string };
};

function PlacesSearchTiles(data: Props) {
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const { googleMapsLibrary } = useAppContext();
  const router = useRouter(); 

  useEffect(() => {
    if (!googleMapsLibrary) return;

    const cuisine = data.formData.cuisine ? `${data.formData.cuisine} food` : "food";

    const budget =
      data.formData.budget == null
        ? google.maps.places.PriceLevel.MODERATE
        : googleMapsLibrary.placesLibrary.PriceLevel[
            data.formData.budget as keyof typeof google.maps.places.PriceLevel
          ];


    const distance = Number(data.formData.distance) * 1609.344;


    const request = {
      textQuery: cuisine,
      fields: [
        "displayName",
        "id",
        "location",
        "formattedAddress",
        "priceLevel",
        "rating",
        "editorialSummary",
        "photos",
      ],
      locationBias: data.position,
      priceLevels: [budget],
      useStrictTypeFiltering: true,
      includedType: "restaurant"
    };

    if (!googleMapsLibrary || !window.google?.maps?.places?.Place || !request) return;

    setLoading(true);

    googleMapsLibrary.placesLibrary.Place.searchByText(request)
      .then((response) => {
        response.places.map((place: Place) => {
          const p1 = new Latlon(data.position.lat, data.position.lng);
          const p2 = new Latlon(place.location?.lat() as number, place.location?.lng() as number);
          const dist = p1.distanceTo(p2);
          if (distance >= dist) {
            return place;
          }
        });
        setResults(response.places || []);
      })
      .catch((err) => {
        console.error("Places search failed:", err);
      })
      .finally(() => setLoading(false));
  }, [data, googleMapsLibrary]);

   const createSlug = (name: string) => {
    return name.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/--+/g, "-");
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {results.map((place: Place) => (
            <div key={place.id} style={styles.card}>
              {place.photos?.[0]?.getURI ? (
                <img
                  width={220}
                  height={140}
                  src={place.photos[0].getURI()}
                  alt={place.displayName || "Place Image"}
                  style={styles.image}
                />
              ) : (
                <div style={styles.noImage}>No Image</div>
              )}
              <h3>{place.displayName}</h3>
              <p>{place.formattedAddress}</p>
              <p style={{ fontSize: "0.85rem", color: "#666" }}>{place.businessStatus}</p>

               <button
                onClick={() => {
                  const slug = createSlug(place.displayName || "restaurant");
                  router.push(`/restaurants/${slug}?id=${place.id}`);
                }}
                style={styles.viewMoreButton}
              >
                View More
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "1rem",
    marginTop: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "relative" as const,
    height: "400px",
  },
  image: {
    width: "100%",
    height: "140px",
    objectFit: "cover" as const,
    borderRadius: "4px",
    marginBottom: "10px",
  },
  noImage: {
    width: "100%",
    height: "140px",
    backgroundColor: "#f0f0f0",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#888",
    marginBottom: "10px",
  },
  viewMoreButton: {
    backgroundColor: "#047857",
    color: "white",
    padding: "8px 16px",
    borderRadius: "9999px",
    border: "none",
    position: "absolute" as const,
    bottom: "10px",
    right: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default PlacesSearchTiles;