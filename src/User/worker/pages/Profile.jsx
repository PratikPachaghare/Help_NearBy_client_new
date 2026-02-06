import React from 'react'
import { WorkerProfile } from '../componets/Profile/workerProfile';

export default function Profile() {
  const sampleWorker = {
  name: "Rahul Sharma",
  category: "Electrician",
  rating: 4,
  experience: 5,
  location: "Pune, Maharashtra",
  phone: "+91 9876543210",
  email: "rahul.electrician@example.com",
  available: true,
  profileImage: "https://randomuser.me/api/portraits/men/75.jpg",
};
  return (
    <div>
      <WorkerProfile worker={sampleWorker}/>
    </div>
  )
}
