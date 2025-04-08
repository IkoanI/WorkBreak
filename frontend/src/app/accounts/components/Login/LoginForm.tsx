'use client';

import { useState } from 'react';
import { getCookie } from 'typescript-cookie';
import { redirect } from "next/navigation";
import LoginInput from "./LoginInput";
import "./LoginForm.css";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
      alert(data.message);
      redirect('/');
    } else {
      alert(JSON.stringify(data));
    }
  };

  return (
    <div className = "login-container">
      <div className = "login-brand">
        <div className = "login-logo-text"> WORKBREAK </div>
      </div>

      <h1 className = "login-title"> Welcome Back </h1>

      <form onSubmit = {handleSubmit} className = "login-form">
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
          <a href = "#" className = "login-link">
            Forgot password?
          </a>
        </div>

        <button type = "submit" className = "login-button">
          Login
        </button>
      </form>

      <div className = "login-footer">
        <p>
          Don't have an account?{" "}
          <a href = "/accounts/signup" className = "login-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
