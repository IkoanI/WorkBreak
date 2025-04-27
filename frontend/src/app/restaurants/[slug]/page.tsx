'use client';
import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams } from 'next/navigation';
import { useAppContext } from "@/app/AppContext";
import "./styles.css";
import TripadvisorReviews from "@/app/components/tripadvisor/TripadvisorReviews";
 declare global {
  interface Window {
    google: typeof google;
  }
}

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

interface UserReview {
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function RestaurantPage() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get("id");
  const { user } = useAppContext();

  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);

  useEffect(() => {
    if (!placeId || typeof window === "undefined" || !window.google?.maps) return;
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
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

        console.log(placeDetails);
      } else {
        setError(true);
      }
    });
  }, [placeId]);

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    const newReview: UserReview = {
      user: user?.username || "Anonymous",
      rating,
      comment,
      created_at: new Date().toISOString(),
    };
    setUserReviews((prev) => [newReview, ...prev]);
    setRating(5);
    setComment('');
  };

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

      <TripadvisorReviews restaurant_name={placeDetails.name || ''} coords={{lat:placeDetails.location?.lat() || 0, lng:placeDetails.location?.lng() || 0}}/>

      <section className="user-reviews-section">
        <h2>Leave Your Review</h2>

        <form onSubmit={handleSubmitReview}>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(+e.target.value)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Comment:
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </label>
          <br />
          <button type="submit" className="submit-review-button">Post Review</button>
        </form>

        <div className="user-reviews-list">
          {userReviews.map((review, idx) => (
            <div key={idx} className="review-card">
              <h3>{review.user}</h3>
              <p>{review.comment}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}