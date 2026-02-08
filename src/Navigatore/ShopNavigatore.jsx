
import React, { useState, useEffect } from 'react';
import { AnalyticsScreen } from '../shopkiper/AnalyticsScreen';
import { InventoryScreen } from '../shopkiper/InventoryScreen';
import { OrdersScreen } from '../shopkiper/OrdersScreen';
import { BillingScreen } from '../shopkiper/BillingScreen';

// --- MOCK DATA (Backend se aisa data aayega) ---
const INITIAL_PRODUCTS = [
  { id: 1, name: 'Wireless Headphones', price: 1500, stock: 10, sold: 45, status: 'Active' },
  { id: 2, name: 'Smart Watch', price: 2500, stock: 0, sold: 120, status: 'Out of Stock' },
  { id: 3, name: 'USB Cable', price: 200, stock: 50, sold: 300, status: 'Active' },
];

const INITIAL_ORDERS = [
  { id: 101, product: 'Smart Watch', qty: 1, total: 2500, status: 'Pending', time: '10:00 AM' },
  { id: 102, product: 'USB Cable', qty: 2, total: 400, status: 'Completed', time: '09:30 AM' },
];
export default function ShopNavigatore() {
const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  
  // Logic for "User ne order kiya, pop up aana chahiye"
  const [newOrderPopup, setNewOrderPopup] = useState(null);

  // Simulation: 5 second baad ek fake order aayega
  useEffect(() => {
    const timer = setTimeout(() => {
      const fakeOrder = { id: 999, product: 'New Arrival Shoes', qty: 1, total: 1200, status: 'Pending', time: 'Just Now' };
      setOrders(prev => [fakeOrder, ...prev]);
      setNewOrderPopup(fakeOrder);
      // Play sound here if needed
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">🛒 Shopkeeper Panel</div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full text-left p-3 rounded ${activeTab === 'dashboard' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
             📊 Analytics & Stats
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full text-left p-3 rounded ${activeTab === 'inventory' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
             📦 Products (Inventory)
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full text-left p-3 rounded ${activeTab === 'orders' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
             🔔 Orders & Alerts
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`w-full text-left p-3 rounded ${activeTab === 'billing' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
             🧾 Billing & Finance
          </button>
        </nav>
        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">Logged in as Owner</div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 overflow-auto relative">
        <header className="bg-white shadow p-4 mb-4">
          <h1 className="text-xl font-bold capitalize">{activeTab} Overview</h1>
        </header>

        <main className="p-4">
          {activeTab === 'dashboard' && <AnalyticsScreen products={products} orders={orders} />}
          {activeTab === 'inventory' && <InventoryScreen products={products} setProducts={setProducts} />}
          {activeTab === 'orders' && <OrdersScreen orders={orders} setOrders={setOrders} />}
          {activeTab === 'billing' && <BillingScreen orders={orders} />}
        </main>

        {/* --- THE POPUP LOGIC --- */}
        {newOrderPopup && (
          <div className="absolute top-5 right-5 bg-white border-l-4 border-green-500 shadow-2xl p-4 w-80 animate-bounce rounded">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-green-700">🚀 New Order Received!</h4>
                <p className="text-sm mt-1">{newOrderPopup.product}</p>
                <p className="text-xs text-gray-500">User is waiting for confirmation.</p>
              </div>
              <button onClick={() => setNewOrderPopup(null)} className="text-gray-400 hover:text-black">✕</button>
            </div>
            <button 
              onClick={() => { setActiveTab('orders'); setNewOrderPopup(null); }}
              className="mt-3 w-full bg-green-600 text-white py-1 rounded text-sm">
              View & Dispatch Now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
