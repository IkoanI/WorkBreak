'use client';

import React, {useState} from 'react';
import { redirect } from "next/navigation";
import LoginInput from "./LoginInput";
import "./LoginForm.css";
import Link from "next/link";
import {BACKEND_ENDPOINT, useAppContext} from "@/app/AppContext";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();
  const {setIsAuthenticated, csrftoken} = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${BACKEND_ENDPOINT}/accounts/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken || ''
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      setIsAuthenticated(true);
      redirect('/home');
    } else {
      setErrors(data);
    }
  };

  // ERROR MESSAGE NEEDS STYLING
  return (
    <div className = "login-container">
      <div className = "login-brand">
        <div className = "login-logo-text"> WORKBREAK </div>
      </div>

      <h1 className = "login-title"> Welcome Back </h1>

      <form onSubmit = {handleSubmit} className = "login-form">
        {errors != undefined && errors["error"] && <p>{errors["error"]}</p>}
        <LoginInput
          label = "Username:"
          type = "text"
          value = {username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <LoginInput
          label = "Password:"
          type = "password"
          value = {password}
          onChange = {(e) => setPassword(e.target.value)}
        />

        <div className = "login-forgot">
          <a href = {`${BACKEND_ENDPOINT}/accounts/password_reset/`} className = "login-link">
            Forgot password?
          </a>
        </div>

        <button type = "submit" className = "login-button">
          Login
        </button>
      </form>

      <div className = "login-footer">
        <p>
          Don&#39;t have an account?{" "}

          <Link href = "/accounts/signup" className = "login-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
