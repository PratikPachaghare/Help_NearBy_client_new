import React from 'react';
import './CardShow.css';
import { useNavigate } from 'react-router-dom';

const CardShow = ({worker}) => {
  const navigate = useNavigate();

  if (!worker) {
    return (
      <div className="card-show-container">
        <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      </div>
    );
  }

  const name = worker?.userId?.name || worker?.name || 'Worker';
  const address = worker?.userId?.address || worker?.address || 'N/A';
  const rating = worker?.ratingAvg || worker?.rating || 0;
  const category = Array.isArray(worker?.categories) ? worker.categories.join(', ') : worker?.categories || 'General';
  const description = worker?.description || 'Skilled local professional';
  const image = worker?.profileImage || 'https://placehold.co/200x200?text=Worker';

  return (
    <div className="card-show-container">
      <button onClick={() => navigate(-1)} className="back-button">← Back</button>
      <div className="card-show">
        <img src={image} alt={name} className="card-show-image" />
        <div className="card-show-details">
          <h2><strong>Name:</strong> {name}</h2>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Rating:</strong> <span className="yellow-text"> {rating}★</span></p>
          <p><strong>Category:</strong> {category}</p>
          <p><strong>Description:</strong> {description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardShow;
