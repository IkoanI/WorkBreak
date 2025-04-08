import React from "react";
import Link from "next/link";
import Image from "next/image";
import "./styles.css";

export default function Footer() {
  return (
    <footer className = "footer">
      <div className = "footer-container">
        <div className = "footer-grid">
          <div className = "footer-section logo-section">
            <div className = "footer-logo-wrapper">
              <Image
                src = "/next/Images/WorkBreakLogo.png"
                alt = "WorkBreak Logo"
                width = {40}
                height = {40}
                className = "footer-logo"
              />
              <div className = "footer-logo-text"> WORKBREAK </div>
            </div>
            <p className = "footer-description">
              Helping professionals make the most of their breaks with timely reminders and great local options.
            </p>
          </div>

          <div className = "footer-section links-section">
            <h3 className = "footer-heading"> Quick Links </h3>
            <nav>
              <ul className = "footer-links">
                <li><Link href = "/home" className = "footer-link"> Home </Link></li>
                <li><Link href = "/about" className = "footer-link"> About </Link></li>
                <li><Link href = "/accounts/login" className = "footer-link"> Login </Link></li>
              </ul>
            </nav>
          </div>

          <div className = "footer-section-contact-section">
            <h3 className = "footer-heading"> Contact Us </h3>
            <div className = "contact-list">
              {["Alina", "Daksh", "Elvis", "Koan", "Steve"].map((name) => (
                <div className = "contact-item" key = {name}>
                  <div className = "contact-icon">
                    <span className = "contact-initial"> {name.charAt(0)} </span>
                  </div>
                  <span className = "contact-name"> {name} </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className = "footer-bottom">
          <p>&copy; {new Date().getFullYear()} WORKBREAK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
