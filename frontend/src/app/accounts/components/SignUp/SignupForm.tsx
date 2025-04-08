'use client';

import { useState } from 'react';
import { getCookie } from 'typescript-cookie';
import { redirect } from "next/navigation";
import SignupInput from "./SignupInput";
import "./SignupForm.css";

/*
   IM NOT GOOD WITH TYPESCRIPT, PROBABLY VIOLATING A BUNCH OF BEST PRACTICES
   ITS OKAY KOAN WE LOVE YOU STILL - ELVIS
*/
export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/accounts/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || '',
      },
      body: JSON.stringify({ username, email, password1, password2 }),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      redirect('/accounts/login');
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <div className = "signup-container">
      <div className = "signup-brand">
        <div className = "signup-logo-text"> WORKBREAK </div>
      </div>

      <h1 className = "signup-title"> Create Your Account </h1>

      <form onSubmit = {handleSubmit} className = "signup-form">
        <SignupInput
          label = "Username:"
          type = "text"
          value = {username}
          onChange = {(e) => setUsername(e.target.value)}
        />
        <SignupInput
          label = "Email:"
          type= " email"
          value = {email}
          onChange = {(e) => setEmail(e.target.value)}
        />
        <SignupInput
          label = "Password:"
          type = "password"
          value = {password1}
          onChange = {(e) => setPassword1(e.target.value)}
        />
        <SignupInput
          label = "Confirm Password:"
          type = "password"
          value = {password2}
          onChange = {(e) => setPassword2(e.target.value)}
        />

        <button type = "submit" className = "signup-button">
          Sign Up
        </button>
      </form>

      <div className = "signup-footer">
        <p> 
          Already have an account?{" "}
          <a href = "/accounts/login" className = "signup-link">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
