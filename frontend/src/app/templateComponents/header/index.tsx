"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import './styles.css'; 

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className = "header">
      <div className = "header-container">
        <div className = "header-top">
          <div className = "logo-section">
            <Image
              src = "/next/Images/WorkBreakLogo.png"
              alt = "WorkBreak Logo"
              width = {50}
              height = {50}
              className = "logo-img"
            />
            <div className = "logo-text"> WORKBREAK </div>
          </div>

          <div className = "desktop-nav">
            <nav>
              <ul className = "nav-links">
                <li><a href = "#" className="nav-link"> Home </a></li>
                <li><a href = "#" className="nav-link"> About </a></li>
              </ul>
            </nav>
            <a href = "/login" className = "login-button">
              <span> Login </span>
            </a>
          </div>

          {/* When Screen Small, Mobile Menu Button Appears */}
          <button className = "mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <nav>
            <ul className = "mobile-links">
              <li><a href = "#" className="mobile-link"> Home </a></li>
              <li><a href = "#" className="mobile-link"> About </a></li>
            </ul>
          </nav>
          <a href = "/login" className = "login-button mobile-login">
            <span> Login </span>
          </a>
        </div>
      
      </div>
    </header>
  );
}
