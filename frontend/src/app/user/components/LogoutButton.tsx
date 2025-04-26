'use client';

import React from 'react';
import { redirect } from "next/navigation";
import "../profile/styles.css";
import {BACKEND_ENDPOINT, useAppContext} from "@/app/AppContext";

export default function LogoutButton() {
  const {setIsAuthenticated, csrftoken} = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_ENDPOINT}/accounts/logout`, {
      headers: {
        'X-CSRFToken': csrftoken || ''
      },
      credentials: 'include',
    });

    if (response.ok) {
      setIsAuthenticated(false);
      redirect('/home');
    }
  };

  // ERROR MESSAGE NEEDS STYLING
  return (
    <form method="post" onSubmit = {handleSubmit}>
      <button type="submit" className = "logout-button">Logout</button>
    </form>
  );
}
