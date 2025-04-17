"use client";

import React, {useState} from 'react';
import Image from 'next/image';
import './styles.css';
import LoginButton from "@/app/templateComponents/header/LoginButton";
import Link from "next/link";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
      <header className = "header">
        <div className = "header-container">
          <div className = "header-top">
            <div className="logo-section">
              <Image
                  src="/next/Images/WorkBreakLogo.png"
                  alt="WorkBreak Logo"
                  width = {50}
                  height = {50}
                  className = "logo-img"
              />
              <div className = "logo-text"> WORKBREAK</div>
            </div>

<<<<<<< HEAD
            <div className = "desktop-nav">
              <nav>

                <ul className = "nav-links">
                  <li><Link href = "/home" className="nav-link"> Home </Link></li>
                  <li><Link href = "/about" className="nav-link"> About </Link></li>
                </ul>
              </nav>

              <LoginButton/>

            </div>
=======
          <div className = "desktop-nav">
            <nav>
              <ul className = "nav-links">
                <li><a href = "/home" className="nav-link"> Home </a></li>
                <li><a href = "/about" className="nav-link"> About </a></li>
              </ul>
            </nav>
            <a href = "/accounts/login" className = "login-button">
              <span> Login </span>
            </a>
          </div>
>>>>>>> 813fb790e69b1f5a734010513366bb07a9bf452b

            {/* When Screen Small, Mobile Menu Button Appears */}
            <button className = "mobile-menu-button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              ☰
            </button>
          </div>

<<<<<<< HEAD
          {/* Mobile Menu */}
          <div className = {`mobile-menu ${isMenuOpen ? "open" : ""}`}>
            <nav>
              <ul className = "mobile-links">
                <li><Link href = "/home" className="mobile-link"> Home </Link></li>
                <li><Link href = "/about" className="mobile-link"> About </Link></li>
              </ul>
            </nav>
            <LoginButton/>
          </div>

=======
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
>>>>>>> 813fb790e69b1f5a734010513366bb07a9bf452b
        </div>
      
      </div>
    </header>
  );
}
