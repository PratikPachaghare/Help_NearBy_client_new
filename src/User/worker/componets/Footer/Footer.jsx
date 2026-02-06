// components/Footer/Footer.jsx
import React from 'react';
import './Footer.css';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Section 1: Logo + Tagline */}
        <div className="footer-section">
          <h2 className="footer-logo">NearKaamWala</h2>
          <p>Connecting skilled workers with people near you.</p>
        </div>

        {/* Section 2: Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/request">Request</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/profile">Profile</a></li>
          </ul>
        </div>

        {/* Section 3: Services */}
        <div className="footer-section">
          <h3>Categories</h3>
          <ul>
            <li>Plumber</li>
            <li>Electrician</li>
            <li>Carpenter</li>
            <li>AC Repair</li>
          </ul>
        </div>

        {/* Section 4: Contact Info */}
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: support@nearkaamwala.com</p>
          <p>Phone: +91 98765 43210</p>
          <div className="footer-social flex mt-4 gap-3 justify-center">
            <a href="#"><FaFacebook /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} NearKaamWala. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
