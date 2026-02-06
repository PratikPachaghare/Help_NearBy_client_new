import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaClipboardList, FaUserCircle } from 'react-icons/fa';
import './BottomNav.css'
import { useSelector } from 'react-redux';

const BottomNav = () => {
  const isLogin = useSelector((state)=>state.user.isLoggedIn);
  return (
    <nav className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
      >
        <FaHome size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink 
        to="/request" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
      >
        <FaClipboardList size={22} />
        <span>Request</span>
      </NavLink>

    {!isLogin?
          <div className="nav-profile">
              <NavLink to="/auth" className="profile-link">
                  <div className='flex'>
                    <div className='bg-blue-500 text-1xl border rounded justify-center text-center p-1 pr-2 pl-2 text-white'>Login</div>
                  </div>
              </NavLink>
            </div>
          :<div className="nav-profile">
              <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
      >
        <FaUserCircle size={22} />
        <span>Profile</span>
      </NavLink>
            </div>}
    </nav>
  );
};

export default BottomNav;
