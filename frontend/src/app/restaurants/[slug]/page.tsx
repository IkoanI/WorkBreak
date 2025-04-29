'use client';

import React, { useEffect, useState, FormEvent } from "react";
import { useSearchParams} from 'next/navigation';
import "./styles.css";
import TripadvisorReviews from "@/app/components/tripadvisor/TripadvisorReviews";
import {BACKEND_ENDPOINT, useAppContext} from "@/app/AppContext";
import Route from "@/app/components/map/Route";

interface PlaceDetails {
  formatted_address?: string;
  rating?: number;
  price_level?: number;
  reviews?: { author_name: string; text: string; rating: number }[];
  photos?: google.maps.places.PlacePhoto[];
  opening_hours?: { weekday_text?: string[] };
  website?: string;
  name?: string;
  location?: google.maps.LatLng;
  place_id?: string;
}

interface UserReview {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
  reply?: string;
}

export default function RestaurantPage() {
  const searchParams = useSearchParams();
  const placeId = searchParams.get("id");
  const { csrftoken, user } = useAppContext();

  const [placeDetails, setPlaceDetails] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isOpen, setIsOpen] = useState<boolean | null>(null);
  const [replyContent, setReplyContent] = useState<Record<number,string>>({});
  const [showReplyBox, setShowReplyBox] = useState<Record<number,boolean>>({});

  const [showEditBox, setShowEditBox] = useState<Record<number,boolean>>({});
  const [editText, setEditText] = useState<Record<number,string>>({});

  const createSlug = (name: string) =>
    name.trim().toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .replace(/-$/, "");

  useEffect(() => {
    if (!placeId || typeof window === "undefined" || !window.google?.maps) return;
    const service = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );
    service.getDetails({ placeId }, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        setPlaceDetails({
          formatted_address: place.formatted_address || "",
          rating: place.rating ?? 0,
          price_level: place.price_level ?? 0,
          reviews:
            place.reviews?.map((r) => ({
              author_name: r.author_name,
              text: r.text,
              rating: r.rating ?? 0,
            })) || [],
          photos: place.photos || [],
          opening_hours: {
            weekday_text: place.opening_hours?.weekday_text || [],
          },
          website: place.website || "",
          name: place.name || "",
          location: place.geometry?.location,
          place_id: place.place_id,
        });
      } else {
        setError(true);
      }
      

    });
  }, [placeId]);

  useEffect(() => {
    if (!placeDetails?.name) return;
    const slug = createSlug(placeDetails.name);
    fetch(`${BACKEND_ENDPOINT}/restaurants/api/${slug}/${placeId}/reviews/`, { credentials: "include" })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(data => setUserReviews(data.reviews || []))
      .catch(() => console.error("Failed to load user reviews"));
    
    fetch(`${BACKEND_ENDPOINT}/user/api/add_history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || '',
      },
      body: JSON.stringify({"place_id": placeDetails.place_id, "slug": slug, "restaurant_name": placeDetails.name, "place_type": "restaurant"}),
      credentials: 'include',
    }).catch(() => console.error("Failed to add history"));
    
  }, [csrftoken, placeDetails?.name, placeDetails?.place_id, placeId]);

  useEffect(() => {
    if (!placeDetails?.opening_hours?.weekday_text) return;
    const now = new Date();
    const dayIndex = now.getDay(); 
    const todayHours = placeDetails.opening_hours.weekday_text[
      dayIndex === 0 ? 6 : dayIndex - 1
    ];
    if (!todayHours) {
      setIsOpen(null);
      return;
    }
    const times = todayHours.match(/\d{1,2}(:\d{2})?\s[APMapm]{2}/g);
    if (!times || times.length < 2) {
      setIsOpen(null);
      return;
    }

    const [openStr, closeStr] = times;
    const parseTime = (str: string) => {
      const [hourStr, minuteStr = "00"] = str.replace(/AM|PM/i, "").trim().split(":");
      const ampm = str.slice(-2).toUpperCase();
      let hour = parseInt(hourStr) % 12;
      if (ampm === "PM") hour += 12;
      return { hour, minute: parseInt(minuteStr) };
    };

    const { hour: openHour, minute: openMin } = parseTime(openStr);
    const { hour: closeHour, minute: closeMin } = parseTime(closeStr);

    const openTime = new Date(now); openTime.setHours(openHour, openMin, 0, 0);
    const closeTime = new Date(now); closeTime.setHours(closeHour, closeMin, 0, 0);

    const nowTime = now.getTime();
    setIsOpen(nowTime >= openTime.getTime() && nowTime <= closeTime.getTime());
  }, [placeDetails]);

  const handleSubmitReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!placeDetails) return;
    const slug = createSlug(placeDetails.name || '');
    const res = await fetch(
      `${BACKEND_ENDPOINT}/restaurants/api/${slug}/create_review/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || ''
        },
        body: JSON.stringify({ rating, comment }),
      }
    );
    if (res.ok) {
      const newReview = await res.json();
      setUserReviews(prev => [newReview, ...prev]);
      setRating(5);
      setComment('');
    } else {
      alert("Failed to submit review.");
    }
  };

  const handleReplySubmit = async (reviewId: number) => {
    const reply = replyContent[reviewId];
    if (!reply || !placeDetails) return;
    const slug = createSlug(placeDetails.name!);
    const res = await fetch(
      `${BACKEND_ENDPOINT}/restaurants/api/${slug}/${placeId}/reply_review/${reviewId}/`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken || "",
        },
        body: JSON.stringify({ reply }),
      }
    );
    if (res.ok) {
      setUserReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? {
                ...r,
                reply,
              }
            : r
        )
      );
      setReplyContent((pc) => ({ ...pc, [reviewId]: "" }));
      setShowReplyBox((sb) => ({ ...sb, [reviewId]: false }));
    } else {
      alert("Failed to submit reply.");
    }
  };

  const handleEditSubmit = async (id:number) => {
    const text = editText[id];
    const response = await fetch(`${BACKEND_ENDPOINT}/restaurants/api/edit_review/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || ''
      },
      body: JSON.stringify({ "id": id, "comment" : text }),
      credentials: 'include',
    });

    if (response.ok) {
      setUserReviews((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                comment: text,
              }
            : r
        )
      );
      setEditText((prev)=>({...prev, [id]: ""}))
      setShowEditBox((prev) => ({...prev, [id]: false}))
    }
  };

  if (error) return <div>Failed to load restaurant.</div>;
  if (!placeDetails) return <div>Loading...</div>;

  const photoUrl = placeDetails.photos?.[0]?.getUrl() || "/placeholder.svg";
  return (
    <div className="restaurant-page-wrapper">
      <div className="restaurant-header">
        <div className="restaurant-info">
          <h1>{placeDetails.name}</h1>
          <p>
            <strong>Address:</strong> {placeDetails.formatted_address}
          </p>
          <p>
            <strong>Rating:</strong> {placeDetails.rating} ⭐
          </p>
          <p>
            <strong>Price Level:</strong>{" "}
            {"$".repeat(placeDetails.price_level || 0)}
          </p>
          {isOpen !== null && (
            <p className={`open-status ${isOpen ? "open" : "closed"}`}>
              {isOpen ? "Open Now" : "Closed"}
            </p>
          )}
          {placeDetails.opening_hours?.weekday_text && (
            <div className="restaurant-hours">
              <strong>Hours:</strong>
              <ul>
                {placeDetails.opening_hours.weekday_text.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
          )}
          {placeDetails.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={placeDetails.website}
                target="_blank"
                rel="noreferrer"
                className="restaurant-website"
              >
                {placeDetails.website}
              </a>
            </p>
          )}
        </div>
        <div className="restaurant-photo">
          <img src={photoUrl} alt="Restaurant" />
        </div>
      </div>

      {/* Google & Tripadvisor & Route */}
      <section className="restaurant-reviews-section">
        <h2>Google Reviews</h2>
        <div className="google-reviews-scroll">
          {placeDetails.reviews?.length ? (
            placeDetails.reviews.map((r, i) => (
              <div key={i} className="google-review-card">
                <h3>{r.author_name}</h3>
                <p>{r.text}</p>
                <p>Rating: {r.rating} ⭐</p>
              </div>
            ))
          ) : (
            <p>No Google reviews available.</p>
          )}
        </div>
      </section>
      <TripadvisorReviews
        restaurant_name={placeDetails.name!}
        coords={{
          lat: placeDetails.location!.lat(),
          lng: placeDetails.location!.lng(),
        }}
      />
      <Route placeId={placeDetails.place_id!} />

      {/* User reviews + reply */}
      <section className="user-reviews-section">
        <h2>WorkBreak User Reviews</h2>
        <form onSubmit={handleSubmitReview} className="review-form">
          <div className="form-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={`star ${n <= rating ? "filled" : ""}`}
                  onClick={() => setRating(n)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="form-group">
            <label>Comment:</label>
            <textarea
              className="form-textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-review-button">
            Post Review
          </button>
        </form>

        <div className="user-reviews-list">
          {userReviews.length === 0 ? (
            <p>No reviews yet. Be the first!</p>
          ) : (
            userReviews.map((rev) => (
              <div key={rev.id} className="user-review-card">
                <h3>{rev.user}</h3>
                <p>{rev.comment}</p>
                <p>Rating: {rev.rating} ⭐</p>

                {rev.user === user?.username && !showEditBox[rev.id] &&
                  <button onClick={() => setShowEditBox((prev) => ({...prev, [rev.id]: true}))}
                          className="submit-review-button"
                  >Edit
                  </button>
                }
                {showEditBox[rev.id] &&
                <div>
                  <textarea name="edit_text"
                            placeholder="Edit your review..."
                            onChange={(e) => setEditText(() => ({...editText, [rev.id]: e.target.value}))}
                            value={editText[rev.id] || ""} />
                  <br/>
                  <button onClick={() => handleEditSubmit(rev.id)} className="submit-review-button">Submit</button>
                </div>}

                {rev.reply && (
                  <div className="review-reply">
                    <strong>Owner Reply:</strong>
                    <p>{rev.reply}</p>
                  </div>
                )}

                {user?.is_restaurant && (
                  <>
                    {!showReplyBox[rev.id] ? (
                      <button
                        onClick={() =>
                          setShowReplyBox((s) => ({ ...s, [rev.id]: true }))
                        }
                        className="submit-review-button"
                      >
                        Reply
                      </button>
                    ) : (
                      <div className="reply-box">
                        <textarea
                          value={replyContent[rev.id] || ""}
                          onChange={(e) =>
                            setReplyContent((c) => ({
                              ...c,
                              [rev.id]: e.target.value,
                            }))
                          }
                          placeholder="Write your reply…"
                        />
                        <br/>
                        <button onClick={() => handleReplySubmit(rev.id)} className="submit-review-button">
                          Submit Reply
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
