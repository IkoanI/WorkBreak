"use client";

import React, { useEffect, useState } from "react";
import Latlon from 'geodesy/latlon-ellipsoidal-vincenty';
import "../../globals.css";
import { useAppContext } from "@/app/AppContext";

type Props = {
  position: { lat: number; lng: number };
  formData: {
    searchQuery: string;
    cuisine: string;
    distance: string;
    budget: string;
  };
};

import Place = google.maps.places.Place;

export default function PlacesSearchTiles({ position, formData }: Props) {
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { googleMapsLibrary } = useAppContext();

  useEffect(() => {
    if (!googleMapsLibrary) return;

    const distanceMeters = Number(formData.distance) * 1609.344;
    const cuisine = formData.cuisine ? `${formData.cuisine} food` : "food";
    const budget = formData.budget
      ? googleMapsLibrary.placesLibrary.PriceLevel[formData.budget as keyof typeof google.maps.places.PriceLevel]
      : google.maps.places.PriceLevel.MODERATE;


    const request = {
      textQuery: cuisine,
      fields: [
        'displayName', 
        'id', 
        'location', 
        'formattedAddress', 
        'priceLevel', 
        'rating', 
        'editorialSummary', 
        'photos'
      ],
      locationBias: position,
      priceLevels: [budget],
      useStrictTypeFiltering: true,
      includedType: "restaurant"
    };

    setLoading(true);

    googleMapsLibrary.placesLibrary.Place.searchByText(request)
      .then((response) => {
        const filtered = (response.places || []).filter((place: Place) => {
          if (!place.location) return false;
          const p1 = new Latlon(position.lat, position.lng);
          const p2 = new Latlon(place.location.lat() as number, place.location.lng() as number);
          const dist = p1.distanceTo(p2);

          const nameMatch = formData.searchQuery
            ? place.displayName?.toLowerCase().includes(formData.searchQuery.toLowerCase())
            : true;

          return dist <= distanceMeters && nameMatch;
        });
        setResults(filtered);
      })
      .catch((err) => console.error('Places search failed:', err))
      .finally(() => setLoading(false));
  }, [position, formData, googleMapsLibrary]);

  const resultsPerPage = 8;
  const indexOfLast = currentPage * resultsPerPage;
  const indexOfFirst = indexOfLast - resultsPerPage;
  const currentResults = results.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(results.length / resultsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div style={{ padding: "20px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={styles.grid}>
            {currentResults.map((place) => (
              <div key={place.id} style={styles.card}>
                {place.photos?.[0]?.getURI() ? (
                  <img
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
              </div>
            ))}
          </div>

          {results.length > resultsPerPage && (
            <div style={styles.pagination}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={styles.pageButton}
              >
                Previous
              </button>
              <span>Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={styles.pageButton}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginTop: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '140px',
    objectFit: 'cover' as const,
    borderRadius: '4px',
    marginBottom: '10px',
  },
  noImage: {
    width: '100%',
    height: '140px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#888',
    marginBottom: '10px',
    borderRadius: '4px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '1rem',
  },
  pageButton: {
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
  },
};
