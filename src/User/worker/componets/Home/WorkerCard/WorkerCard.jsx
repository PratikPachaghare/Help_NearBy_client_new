import React from 'react';
import './WorkerCard.css';

const WorkerCard = ({ worker }) => {
  if (!worker) return <div className="worker-card">Loading...</div>;

  const fallbackImage = "https://placehold.co/150x150?text=Worker";

  return (
    <div className="worker-card">
      <div className="image-container">
        <img 
          src={worker.profileImage || fallbackImage} 
          alt={worker.name} 
          className="worker-image" 
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <div className="rating-badge">
          <span className="rating-text">
            {worker.rating || "0"}<span className="text-amber-300">★</span>
          </span>
        </div>
      </div>
      <div className="worker-info">
        <h3>{worker.name || "Unknown Worker"}</h3>
        <p>
          {worker.address 
            ? worker.address.split(",").slice(0, 2).join(", ") 
            : "Amravati, MH"}
        </p>
        <div className='flex justify-center gap-2'>
          <p className='m-1 mt-3 text-blue-700'>{worker.categories || "General"}</p>
          <button className='bg-amber-300'>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;