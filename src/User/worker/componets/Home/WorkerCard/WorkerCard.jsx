import React from 'react';
import './WorkerCard.css';

const WorkerCard = ({ worker }) => {
  if (!worker) return <div className="worker-card">Loading...</div>;

  const fallbackImage = "https://placehold.co/150x150?text=Worker";
  const displayName = worker?.userId?.name || worker?.name || "Unknown Worker";
  const displayAddress = worker?.userId?.address || worker?.address || "Amravati, MH";
  const displayCategory = Array.isArray(worker?.categories) ? worker.categories[0] : worker?.categories || "General";
  const displayRating = worker?.ratingAvg || worker?.rating || "0";

  return (
    <div className="worker-card">
      <div className="image-container">
        <img 
          src={worker.profileImage || fallbackImage} 
          alt={displayName} 
          className="worker-image" 
          onError={(e) => { e.target.src = fallbackImage; }}
        />
        <div className="rating-badge">
          <span className="rating-text">
            {displayRating}<span className="text-amber-300">★</span>
          </span>
        </div>
      </div>
      <div className="worker-info">
        <h3>{displayName}</h3>
        <p>
          {displayAddress 
            ? displayAddress.split(",").slice(0, 2).join(", ") 
            : "Amravati, MH"}
        </p>
        <div className='flex justify-center gap-2'>
          <p className='m-1 mt-3 text-[#14566c] font-semibold'>{displayCategory}</p>
          <button className='bg-[#0f3d4c] text-white px-3 rounded-md hover:bg-[#14566c] transition'>Book Now</button>
        </div>
      </div>
    </div>
  );
};

export default WorkerCard;