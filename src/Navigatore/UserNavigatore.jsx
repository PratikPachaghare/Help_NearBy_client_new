/* UserNavigatore.jsx */
import { Routes, Route } from 'react-router-dom';
import UserLayout from '../layout/UserLayout';
import GroceryNav from './sub-nav/GroceryNav';
import WorkerNav from './sub-nav/WorkerNav';
import MedicalNav from './sub-nav/MedicalNav';
import GroceryHome from '../User/Grocery/pages/Home/GroceryHome';
import ProductDetail from '../pages/ProductDetail';

export default function UserNavigatore() {
  return (
   <Routes>
      <Route element={<UserLayout />}>
        {/* Jab user dashboard par aaye, use default Grocery dikhega */}
        <Route index element={<GroceryHome />} /> 
        
        {/* Ye routes tab chalenge jab user Top Nav par click karega */}
        <Route path="grocery/*" element={<GroceryNav />} />
        <Route path="worker/*" element={<WorkerNav />} />
        <Route path="medical/*" element={<MedicalNav />} />
        <Route path="product/:id" element={<ProductDetail />} />
      </Route>
    </Routes>
  );
}