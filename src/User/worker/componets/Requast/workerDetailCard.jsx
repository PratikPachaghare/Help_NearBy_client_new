import React from 'react';
import './CardShow.css';
import worker_image from '../../Assets/worker-image.png';
import { useNavigate } from 'react-router-dom';

const CardShow = ({worker}) => {
  const navigate = useNavigate();

  return (
    <div className="card-show-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <div className="card-show">
        <img src={worker.profileImage} alt="Amit Sharma" className="card-show-image" />
        <div className="card-show-details">
          <h2><strong>Name:</strong> {worker.name}</h2>
          <p><strong>Gender:</strong> {worker.gender}</p>
          <p><strong>Address:</strong> {worker.address}</p>
          <p><strong>Rating:</strong> <span className="yellow-text"> {worker.rating}★</span></p>
          <p><strong>category:</strong> {worker.categories}</p>
          <p><strong>Subcategory:</strong> {worker.subcategories}</p>
          <p><strong>Description:</strong> {worker.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardShow;
