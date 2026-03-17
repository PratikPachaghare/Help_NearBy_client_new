import { Routes, Route } from 'react-router-dom';
import GroceryHome from '../../User/Grocery/pages/Home/GroceryHome';
import ProductDetail from '../../pages/ProductDetail';
import GroceryCart from '../../User/Grocery/pages/GroceryCart';
import Orders from '../../User/Grocery/pages/MyOrders';
import ServiceShell from '../../layout/ServiceShell';

export default function GroceryNav() {
  return (
    <ServiceShell
      tag="User Services"
      title="Grocery Marketplace"
      subtitle="Fast local delivery with verified products, transparent pricing, and organized order tracking."
    >
      <Routes>
        <Route index element={<GroceryHome />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route path="cart" element={<GroceryCart mode="grocery" />} />
        <Route path="myOrders" element={<Orders mode="grocery" />} />
      </Routes>
    </ServiceShell>
  );
}