import React from "react";
import "./styles.css";

export default function About() {
  return (
    <main className = "about-container">
      <h1 className = "about-heading"> About WorkBreak </h1>

      <p className = "about-paragraph">
        WorkBreak is your personal guide to discovering the best restaurants during your workday breaks.
        Whether you're looking for a quick bite, a cozy lunch spot, or a place to unwind after hours, WorkBreak
        helps you find the perfect restaurant based on your taste, budget, and preferences.
      </p>

      <p className = "about-paragraph">
        Our mission is to make your break time enjoyable and stress-free by offering smart filtering,
        real-time directions, and access to reviews from both fellow users and platforms like TripAdvisor.
      </p>

      <p className = "about-paragraph">
        We believe in providing a platform where users, restaurant owners, and admins can interact
        transparently. Users can customize their profiles, leave and manage reviews, and explore past visits.
        Restaurant owners can connect directly with customers by responding to reviews and sharing updates. Admins
        ensure that content stays fresh and accurate for everyone.
      </p>

      <p className = "about-paragraph">
        Whether you're craving something new or looking to revisit a favorite spot, WorkBreak is designed to make
        every food journey easy, informed, and enjoyable.
      </p>
    </main>
  );
}
