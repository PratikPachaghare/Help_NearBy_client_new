import { Routes, Route } from 'react-router-dom';
import MedicalHome from '../../User/medical/MedicalHome';
import ChatWithPharmacist from '../../User/medical/ChatWithPharmacist';

export default function MedicalNav() {
  return (
    <Routes>
      <Route index element={<MedicalHome />} /> {/* Prescription upload button here */}
      <Route path="chat" element={<ChatWithPharmacist />} />
    </Routes>
  );
}