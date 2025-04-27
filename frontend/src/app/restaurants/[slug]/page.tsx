'use client';
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import "./styles.css";
import TripadvisorReviews from "@/app/components/tripadvisor/TripadvisorReviews";

interface PlaceDetails {
  formatted_address?: string;
  rating?: number;
  price_level?: number;
  reviews?: {
    author_name: string;
    text: string;
    rating: number;
  }[];
  photos?: google.maps.places.PlacePhoto[];
  opening_hours?: {
    weekday_text?: string[];
  };
  website?: string;
  name?: string;
  location?: google.maps.LatLng;
}

export default function RestaurantPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const placeId = searchParams.get("id");

  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!placeId || typeof window === "undefined" || !google?.maps) return;

    const fetchPlaceDetails = () => {
      const service = new google.maps.places.PlacesService(document.createElement("div"));
      service.getDetails({ placeId }, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          setPlaceDetails({
            formatted_address: place.formatted_address || "",
            rating: place.rating ?? 0,
            price_level: place.price_level ?? 0,
            reviews: place.reviews?.map((r) => ({
              author_name: r.author_name,
              text: r.text,
              rating: r.rating ?? 0
            })) || [],
            photos: place.photos || [],
            opening_hours: {
              weekday_text: place.opening_hours?.weekday_text || []
            },
            website: place.website || "",
            name: place.name || "",
            location: place.geometry?.location || new google.maps.LatLng(0, 0)
          });
        } else {
          setError(true);
        }
      });
    };

    fetchPlaceDetails();
  }, [placeId]);

  if (error) return <div>Failed to load.</div>;
  if (!placeDetails) return <div>Loading…</div>;

  return (
    <div className="restaurant-details-page">
      <h1 className="restaurant-title">{placeDetails.name}</h1>

      <section className="restaurant-section">
        <h2>Location Details</h2>
        <p><strong>Address:</strong> {placeDetails.formatted_address}</p>
        <p><strong>Rating:</strong> {placeDetails.rating} ⭐</p>
        <p><strong>Price Level:</strong> {"$".repeat(placeDetails.price_level || 0)}</p>

        {placeDetails.opening_hours?.weekday_text && (
          <div>
            <strong>Hours:</strong>
            <ul>
              {placeDetails.opening_hours.weekday_text.map((day, idx) => (
                <li key={idx}>{day}</li>
              ))}
            </ul>
          </div>
        )}

        {placeDetails.website && (
          <p>
            <strong>Website:</strong>{" "}
            <a href={placeDetails.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              {placeDetails.website}
            </a>
          </p>
        )}
      </section>

      <section className="restaurant-reviews-section">
        <h2>Google Reviews</h2>
        {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
          placeDetails.reviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <h3>{review.author_name}</h3>
              <p>{review.text}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </section>
    </div>
  );
}