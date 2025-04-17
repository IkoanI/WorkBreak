'use client';

import React, {useContext, useState} from 'react';
import { getCookie } from 'typescript-cookie';
import { redirect } from "next/navigation";
import LoginInput from "./LoginInput";
import "./LoginForm.css";
import {useAppContext} from "@/app/AppContext";
import Link from "next/link";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState();
  const { setUser } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/accounts/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCookie('csrftoken') || ''
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    const data = await response.json();

    if (response.ok) {
      setUser({username: username, isAuthenticated: true})
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
          <a href = "/accounts/password_reset/" className = "login-link">
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
