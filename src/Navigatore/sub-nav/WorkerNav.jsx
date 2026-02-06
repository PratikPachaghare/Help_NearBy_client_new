import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../User/worker/pages/Home';
import Profile from '../../User/worker/pages/Profile';
import Request from '../../User/worker/pages/Requast';
import About from '../../User/worker/pages/About';
import RequestForm from '../../User/worker/componets/Requast/RequestForm';
import { useState } from 'react';
import Navbar from "../../User/worker/componets/Navbar/Navbar"

export default function WorkerNav() {
  const [isWorker, setIsWorker] = useState(false);
  const [userId] = useState("user123"); 

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Path "" or "/" is the index of /worker/ */}
        <Route path="/" element={<Home isWorker={isWorker}/>} />
        
        {/* REMOVE the leading slashes here */}
        <Route path="profile" element={<Profile />} />
        <Route path="request" element={<Request />} />
        <Route path="about" element={<About />} />
        
        {/* This will match /worker/sendRequest */}
        <Route path="sendRequest" element={<RequestForm userId={userId}/>} />
        
        {/* Catch-all: redirect to /worker/ home if path is wrong */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}