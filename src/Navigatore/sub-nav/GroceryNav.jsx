import { Routes, Route } from 'react-router-dom';
import GroceryHome from '../../User/Grocery/pages/Home/GroceryHome';
import ProductDetails from '../../User/Grocery/pages/ProductDetails';
import GroceryCart from '../../User/Grocery/pages/GroceryCart';
import Orders from '../../User/Grocery/pages/MyOrders';

export default function GroceryNav() {
  return (
    <Routes>
      <Route index element={<GroceryHome />} /> {/* Search, Filters, Cards */}
      <Route path="product/:id" element={<ProductDetails />} /> {/* Stock, Delivery Time, Reviews */}
      <Route path="cart" element={<GroceryCart />} />
      <Route path="myOrders" element={<Orders />} />
    </Routes>
  );
}