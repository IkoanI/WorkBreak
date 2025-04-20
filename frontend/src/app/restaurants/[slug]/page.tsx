import React from "react";
import "./styles.css";
import { notFound } from "next/navigation";

const restaurantData = [
  { slug: 'chipotle', name: 'Chipotle', description: 'Mexican Grill' },
  { slug: 'sweetgreen', name: 'Sweetgreen', description: 'Healthy salads & bowls' },
  // add more entries here or fetch from backend
];

export default function RestaurantPage({ params }: { params: { slug: string }}) {
  const restaurant = restaurantData.find((r) => r.slug === params.slug);

  if (!restaurant) {
    notFound();
  }

  return (
    <div className="restaurant-page">
      <h1>{restaurant.name}</h1>
      <p>{restaurant.description}</p>
      {/* Add more details about the restaurant here */}
    </div>
  );
}
