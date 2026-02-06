// components/WorkerProfile.js

import React from 'react';
import './WorkerProfile.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/userSlice';

export const WorkerProfile = () => {
  const user = useSelector((state)=>state.user.userData);
  const isWorker = useSelector((state)=> state.user.isWorker);
  console.log("in profile page :",isWorker);
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const handleLogout = ()=>{
    dispatch(logout())
    localStorage.removeItem("workerToken");
    localStorage.removeItem("UserToken");
    localStorage.removeItem("isWorker");
    navigator('/auth');
    window.location.reload();
  }

  return (
    <div className="profile-container">
      {isWorker == 'true'?<div className="profile-card">
        
        {/* Profile Image */}
        <div className="profile-image">
          <img src={user.profileImage} alt="Worker" />
        </div>

        {/* Worker Details */}
        <div className="profile-details">
          <div className="header">
            <h2>{user.name}</h2>
            <button className="edit-btn">Edit</button>
          </div>
          <p className="category">{user.category}</p>

          {/* Rating */}
          <div className="rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`star ${i < user.rating ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-text">({user.rating}/5)</span>
            <span className="rating-text">total rating : ({user.ratingSum})</span>
          </div>

          {/* Info */}
          <div className="info-grid">
            <p><strong>Experience:</strong> {user.experience} years</p>
            <p><strong>Location:</strong> {user.address}</p>
            <p><strong>Phone:</strong> {user.phone} </p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>gender:</strong> {user.gender}</p>
            <p><strong>categories:</strong> {user.categories}</p>
            <p><strong>description:</strong> {user.description}</p>
            {/* <p><strong>Status:</strong> {user.available ? "Available" : "Not Available"}</p> */}
          </div>
            <div>
              <button className="edit-profile-btn">Edit Profile</button>
              <button onClick={handleLogout} className="m-2 p-3 rounded-xl hover:bg-red-700 cursor-pointer bg-red-500 text-white">Logout</button>
            </div>
        </div>
      </div>:
      <div>
        {/* Worker Details */}
        <div className="profile-details">
          <div className="header">
            <h2> {user.name} </h2>
            <button className="edit-btn">Edit</button>
          </div>
             {/* Info */}
          <div className="info-grid">
            <p><strong>Location:</strong> {user.address}</p>
            <p><strong>Phone:</strong> {user.phone} </p>
            <p><strong>Email:</strong> {user.email}</p>
            {/* <p><strong>Status:</strong> {user.available ? "Available" : "Not Available"}</p> */}
          </div>
            <div>
              <button className="edit-profile-btn">Edit Profile</button>
              <button onClick={handleLogout} className="m-2 p-3 rounded-xl hover:bg-red-700 cursor-pointer bg-red-500 text-white">Logout</button>
            </div>
        </div>
      </div>
      }
      
    </div>
  );
};




