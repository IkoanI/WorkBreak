'use client';
import React from "react";
import "./styles.css";

import { useParams } from 'next/navigation';
import { useState, useEffect, FormEvent } from 'react';
import {BACKEND_ENDPOINT, useAppContext} from "@/app/AppContext";

interface Restaurant {
  name: string;
  description: string;
}

interface UserReviews {
  user: string;
  restaurant_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function RestaurantPage() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState(false);
  const [reviews, setReviews] = useState<UserReviews[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const { csrftoken } = useAppContext();

  // restaurant
  useEffect(() => {
    
    if (!slug) return;
    fetch(`${BACKEND_ENDPOINT}/restaurants/api/${slug}/`, {
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => setRestaurant(data))
      .catch(() => setError(true));
  }, [slug]);

  // get reviews
  useEffect(() => {
    if (!slug) return;
    fetch (`${BACKEND_ENDPOINT}/restaurants/api/${slug}/`, {
      credentials: 'include',
    })
      .then(restaurant => restaurant.json())
      .then(setReviews);
    } , [slug]);

    // write review
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();

      //cant fetch review to post, need help
      //in workbreak/setting.py changed 3000 port to 8000 to check if it works, allowed page to render in 8000 port
      //but still correctly fetching user review from backend

      const res = await fetch(`${BACKEND_ENDPOINT}/restaurants/api/${slug}/create_review/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken || ''
        },
        body: JSON.stringify({ rating, comment }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prevReviews) => [newReview, ...prevReviews]);
        setRating(5);
        setComment('');
      } else {
        alert('Failed to post review');
      }
    };
    if (error) return <div>Failed to load.</div>;
    if (!restaurant) return <div>Loading…</div>;


  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      <section>
        <h2>Leave a Review</h2>

        <div>
          {reviews.map(review => (
            <div key={review.user}>
              <h3>{review.user}</h3>
              <p>{review.comment}</p>
              <p>Rating: {review.rating}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            Rating:
            <select value={rating} onChange={e => setRating(+e.target.value)}>  
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
          <br/>
          <label>
            Comment:
            <textarea value={comment} onChange={e => setComment(e.target.value)} />
          </label>
          <br/>
          <button type="submit">Post Review</button>
        </form>
      </section>

    </div>
  );
}



