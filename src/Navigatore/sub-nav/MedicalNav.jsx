import { Routes, Route } from 'react-router-dom';
import GroceryMedical from '../../pages/GroceryMedical';
import ProductDetail from '../../pages/ProductDetail';
import PrescriptionUpload from '../../pages/PrescriptionUpload';
import ChatWithPharmacist from '../../User/medical/ChatWithPharmacist';
import GroceryCart from '../../User/Grocery/pages/GroceryCart';
import Orders from '../../User/Grocery/pages/MyOrders';
import ServiceShell from '../../layout/ServiceShell';

export default function MedicalNav() {
  return (
    <ServiceShell
      tag="User Services"
      title="Medical Assistance"
      subtitle="Access certified pharmacies, medicine search, prescription uploads, and guided healthcare fulfillment."
    >
      <Routes>
        <Route index element={<GroceryMedical type="medical" />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<GroceryCart mode="medical" />} />
        <Route path="myOrders" element={<Orders mode="medical" />} />
        <Route path="prescriptions" element={<PrescriptionUpload />} />
        <Route path="chat" element={<ChatWithPharmacist />} />
      </Routes>
    </ServiceShell>
  );
}