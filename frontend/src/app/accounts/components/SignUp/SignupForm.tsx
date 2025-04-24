'use client';

import React, { useState } from 'react';
import { getCookie } from 'typescript-cookie';
import { redirect } from "next/navigation";
import SignupInput from "./SignupInput";
import "./SignupForm.css";
import Link from "next/link";
import {BACKEND_ENDPOINT, useAppContext} from "@/app/AppContext";
import AsyncSelect from "react-select/async";

/*
   IM NOT GOOD WITH TYPESCRIPT, PROBABLY VIOLATING A BUNCH OF BEST PRACTICES
   ITS OKAY KOAN WE LOVE YOU STILL - ELVIS
*/
export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [is_restaurant, setIsRestaurant] = useState(false);
  const [restaurant_name, setRestaurantName] = useState('');
  const [place_id, setPlaceID] = useState('');
  const { googleMapsLibrary } = useAppContext();
  const [errors, setErrors] = useState();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${BACKEND_ENDPOINT}/accounts/api/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: JSON.stringify({ username, email, password1, password2, is_restaurant, restaurant_name, place_id }),
      credentials: 'include',
    });

    const data = await response.json();
    if (response.ok) {
      redirect('/accounts/login');
    } else {
      setErrors(data);
    }
  };

  const loadOptions = async (inputValue: string) => {
    const request = {
            textQuery: inputValue,
            fields: ["displayName",  "formattedAddress", "id"],
            includedType: "restaurant",
            useStrictTypeFiltering: true,
    }

    if (!googleMapsLibrary || !window.google?.maps?.places?.Place || !request) return [];

    const response = await googleMapsLibrary.placesLibrary.Place.searchByText(request);
    return response.places.map(place => ({
      value: place.id,
      label: `${place.displayName} (${place.formattedAddress})`
    }));
  }

  const handleRestaurantChange = (e: { label: React.SetStateAction<string>; value: React.SetStateAction<string>; } | null) => {
    setRestaurantName(e == null ? "" : e.label)
    setPlaceID(e == null ? '' : e.value)
  }

  // ERROR MESSAGES NEED STYLING
  return (
    <div className = "signup-container">
      <div className = "signup-brand">
        <div className = "signup-logo-text"> WORKBREAK </div>
      </div>

      <h1 className = "signup-title"> Create Your Account </h1>
      <form onSubmit = {handleSubmit} className = "signup-form">
        {errors != undefined && errors["username"] && <p>{errors["username"]}</p>}
        <SignupInput
          label = "Username:"
          type = "text"
          value = {username}
          onChange = {(e) => setUsername(e.target.value)}
        />

        {errors != undefined && errors["email"] && <p>{errors["email"]}</p>}
        <SignupInput
          label = "Email:"
          type= "email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />

        {errors != undefined && errors["password1"] && <p>{errors["password1"]}</p>}
        <SignupInput
          label = "Password:"
          type = "password"
          value = {password1}
          onChange = {(e) => setPassword1(e.target.value)}
        />

        {errors != undefined && errors["password2"] && <p>{errors["password2"]}</p>}
        <SignupInput
          label = "Confirm Password:"
          type = "password"
          value = {password2}
          onChange = {(e) => setPassword2(e.target.value)}
        />

        {errors != undefined && errors["place_id"] && <p>{errors["place_id"]}</p>}
        {is_restaurant &&
            <div className = "signup-input-group" >
              <label className="signup-label">
              Restaurant Name:
              <AsyncSelect loadOptions={loadOptions}
                onChange={handleRestaurantChange}
                placeholder=""
                className="search-input-container"
                classNamePrefix="search-input"
                defaultInputValue={restaurant_name}
                />
            </label>
            </div>

            }

        <label>
          I am a restaurant: <input type = "checkbox" checked={is_restaurant} onChange = {(e) => setIsRestaurant(e.target.checked)} />
        </label>


        <button type = "submit" className = "signup-button">
          Sign Up
        </button>
      </form>

      <div className = "signup-footer">
        <p> 
          Already have an account?{" "}
          <Link href = "/accounts/login" className = "signup-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
