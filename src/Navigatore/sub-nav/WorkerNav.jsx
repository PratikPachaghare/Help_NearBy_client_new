import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../User/worker/pages/Home';
import Profile from '../../User/worker/pages/Profile';
import Request from '../../User/worker/pages/Requast';
import About from '../../User/worker/pages/About';
import RequestForm from '../../User/worker/componets/Requast/RequestForm';
import { useState } from 'react';
import Navbar from '../../User/worker/componets/Navbar/Navbar';
import ServiceShell from '../../layout/ServiceShell';

export default function WorkerNav() {
  const [isWorker] = useState(false);
  const [userId] = useState('user123');

  return (
    <ServiceShell
      tag="User Services"
      title="Skilled Worker Hub"
      subtitle="Book trusted professionals with clear categories, service history, and reliable response flow."
    >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home isWorker={isWorker} />} />
        <Route path="profile" element={<Profile />} />
        <Route path="request" element={<Request />} />
        <Route path="about" element={<About />} />
        <Route path="sendRequest" element={<RequestForm userId={userId} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ServiceShell>
  );
}