import React, { useState } from 'react';
import './Pendding.css';

// --- MOCK DATA ---
const IS_WORKER_RAW = true; 

export default function PeddingRequast({ pending = [], handleAccept, handleReject }) {
  const [lightboxImage, setLightboxImage] = useState(null);
  const isWorker = IS_WORKER_RAW;

  return (
    <div className="request-list">
      {pending.length === 0 ? (
        <p className="text-center p-5">No new requests.</p>
      ) : (
        pending.map((req) => (
          <div key={req._id} className="request-card border p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">Request Details</h3>
            <strong>Name: {isWorker ? (req.user?.name || 'User') : (req.worker?.name || 'Worker')}</strong>
            <p><strong>Address:</strong> {req.user?.address || req.worker?.address || 'N/A'}</p>
            <p><strong>Message:</strong> {req.message}</p>
            <p><strong>Date:</strong> {req.requestedDate ? new Date(req.requestedDate).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Time:</strong> {req.requestedTime || 'N/A'}</p>

            {req.image && (
              <div className="my-3">
                <img
                  src={req.image}
                  alt="problem"
                  className="w-full max-w-[200px] rounded cursor-pointer"
                  onClick={() => setLightboxImage(req.image)}
                />
              </div>
            )}

            <div className="flex gap-2 mt-4">
              {isWorker && (
                <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => handleAccept(req)}>
                  Accept
                </button>
              )}
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => handleReject(req._id)}>
                {isWorker ? "Reject" : "Cancel"}
              </button>
            </div>
          </div>
        ))
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999]" onClick={() => setLightboxImage(null)}>
          <img src={lightboxImage} alt="Zoomed" className="max-w-[90%] max-h-[90%]" />
        </div>
      )}
    </div>
  );
}