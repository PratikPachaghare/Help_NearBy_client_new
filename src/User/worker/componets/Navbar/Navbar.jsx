import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './Navbar.css';
import logo_img from '../../Assets/logo.jpg';

// RAW DATA: This replaces the data you would normally get from the database
const RAW_USER_DATA = {
  name: "Guest User",
  photo: null, // You can add a URL here if you want an image
  isLoggedIn: true // Change to false to see the Login/Register buttons
};

const Navbar = () => {
  // Use raw data instead of useSelector
  const user = RAW_USER_DATA;
  const login = RAW_USER_DATA.isLoggedIn;

  return (
    <nav className="navbar bg-amber-300 rounded-xl">
      <div className="navbar-left">
        <NavLink to="/worker" className="logo-link">
          <img src={logo_img} alt="Logo" className="logo-img" />
          <span className="logo-text">Welcome to Nearest Service Hub</span>
        </NavLink>
      </div>

      <div className="navbar-right">
        <div className="nav-links">
          {/* Note: relative paths (no /) to stay within the worker section */}
          <NavLink to="/worker" end className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink>
          <NavLink to="/worker/request" className={({ isActive }) => isActive ? 'active-link' : ''}>Request</NavLink>
          <NavLink to="/worker/about" className={({ isActive }) => isActive ? 'active-link' : ''}>About</NavLink>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;