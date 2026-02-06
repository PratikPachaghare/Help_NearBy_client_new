import React, { useEffect, useState } from 'react';
import './Requast.css';
import PeddingRequast from '../componets/Requast/PeddingRequast';
import AcceptedRequeast from '../componets/Requast/AcceptedRequeast';
import { Loader2 } from '../componets/Loder/Loader';

const MOCK_DB = {
  pending: [
    {
      _id: "req_1",
      user: { name: "Amit Sharma", address: "Raja Peth, Amravati", phone: "9876543210" },
      message: "Switchboard sparking",
      requestedDate: new Date().toISOString(),
      requestedTime: "10:00 AM"
    }
  ],
  accepted: [
    {
      _id: "req_2",
      user: { name: "Priya Patil", address: "Sai Nagar, Amravati", phone: "9123456789" },
      message: "Tap leaking in kitchen",
      requestedDate: new Date().toISOString(),
      requestedTime: "02:30 PM",
      worker: { address: "Worker Hub" },
      location: { coordinates: [77.7800, 20.9380] }
    }
  ]
};

const Requast = () => {
  const isWorker = true; 
  const [activeTab, setActiveTab] = useState('request');
  const [pending, setPending] = useState(MOCK_DB.pending);
  const [accepted, setAccepted] = useState(MOCK_DB.accepted);

  const handleAccept = (req) => {
    setAccepted([...accepted, req]);
    setPending(pending.filter((r) => r._id !== req._id));
  };

  const handleReject = (id) => {
    setPending(pending.filter((r) => r._id !== id));
  };

  return (
    <div className="request-container">
      <div className="request-tabs">
        <button className={activeTab === 'request' ? 'tab active' : 'tab'} onClick={() => setActiveTab('request')}>
          {isWorker ? "Requests Received" : "Requests Sent"}
        </button>
        <button className={activeTab === 'accepted' ? 'tab active' : 'tab'} onClick={() => setActiveTab('accepted')}>
          Accepted
        </button>
      </div>
      <div className="request-content">
        {activeTab === 'request' && (
          <PeddingRequast pending={pending} handleAccept={handleAccept} handleReject={handleReject} />
        )}
        {activeTab === 'accepted' && (
          <AcceptedRequeast accepted={accepted} workerLocation={[20.9374, 77.7796]} />
        )}
      </div>
    </div>
  );
};

export default Requast;