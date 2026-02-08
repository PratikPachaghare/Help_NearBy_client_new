import React, { useState } from 'react';
import { HomeScreen } from '../deliveryBoy/HomeScreen';
import { MyOrdersScreen } from '../deliveryBoy/MyOrdersScreen';
import { HistoryScreen } from '../deliveryBoy/HistoryScreen';
import { ProfileScreen } from '../deliveryBoy/ProfileScreen';
import { ActiveOrderScreen } from '../deliveryBoy/ActiveDeliveryScreen';

// --- ENHANCED DATA WITH KM BREAKDOWN ---
const MOCK_NEW_ORDERS = [
  { 
    id: 101, 
    shopName: 'Pizza Hut', 
    shopAddress: 'MG Road, Sector 14', 
    shopDist: '2.5 km', // Distance from you to shop
    
    customerName: 'Rahul Sharma', 
    customerAddress: 'Flat 402, Sunshine Appt', 
    custDist: '4.0 km', // Distance from shop to user
    
    price: 150, tip: 20, 
    items: '2x Large Pizza, 1x Coke', 
    paymentMethod: 'Prepaid', otp: '4589',
    time: '20 mins'
  },
  { 
    id: 102, 
    shopName: 'Apollo Pharmacy', 
    shopAddress: 'City Mall', 
    shopDist: '1.0 km',
    
    customerName: 'Priya Verma', 
    customerAddress: 'H.No 55, Green Park', 
    custDist: '1.2 km',
    
    price: 80, tip: 0, 
    items: 'Medicine Package', 
    paymentMethod: 'Cash', otp: '1122',
    time: '10 mins'
  }
];

export default function DeliveryNavigator() {
  const [activeTab, setActiveTab] = useState('home'); // home, myorders, history, profile
  const [isOnline, setIsOnline] = useState(true);
  
  // STATE
  const [availableOrders, setAvailableOrders] = useState(MOCK_NEW_ORDERS);
  const [myOrders, setMyOrders] = useState([]); // Array for multiple orders
  const [selectedOrderId, setSelectedOrderId] = useState(null); // To show detailed screen
  const [earnings, setEarnings] = useState(1200);
  const [history, setHistory] = useState([]);

  // 1. ACCEPT ORDER
  const handleAccept = (order) => {
    setAvailableOrders(prev => prev.filter(o => o.id !== order.id));
    // Add to My Orders with initial status
    setMyOrders(prev => [...prev, { ...order, status: 'Accepted', step: 1 }]);
    alert("Order Accepted! Added to 'My Orders'.");
  };

  // 2. OPEN SPECIFIC ORDER
  const handleOpenOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  // 3. BACK TO LIST
  const handleBackToList = () => {
    setSelectedOrderId(null);
  };

  // 4. UPDATE STATUS (Inside specific order)
  const handleStatusUpdate = (orderId, newStatus, step) => {
    if (newStatus === 'COMPLETED') {
      // Find the order to calculate earnings
      const order = myOrders.find(o => o.id === orderId);
      const total = order.price + order.tip;
      
      setEarnings(prev => prev + total);
      setHistory(prev => [{...order, status: 'Delivered', amount: total, date: 'Just Now'}, ...prev]);
      
      // Remove from active list
      setMyOrders(prev => prev.filter(o => o.id !== orderId));
      setSelectedOrderId(null);
      alert(`✅ Order Delivered! You earned ₹${total}`);
    } else {
      // Update status locally
      setMyOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, step: step } : o));
    }
  };

  // RENDER LOGIC
  // If a specific order is selected, show that screen ONLY (Full Screen Mode)
  const activeOrderData = myOrders.find(o => o.id === selectedOrderId);
  
  if (selectedOrderId && activeOrderData) {
    return (
      <ActiveOrderScreen 
        order={activeOrderData} 
        onBack={handleBackToList} 
        onUpdateStatus={handleStatusUpdate} 
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto border-x shadow-2xl relative">
      
      {/* HEADER */}
      <header className="bg-white p-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">🚀 FastDelivery</h1>
          <p className="text-xs text-gray-400">{isOnline ? 'Online' : 'Offline'}</p>
        </div>
        <div onClick={() => setIsOnline(!isOnline)} className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isOnline ? 'ON DUTY' : 'OFF DUTY'}
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {!isOnline ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
             <span className="text-4xl">😴</span><p>Go Online to start</p>
          </div>
        ) : (
          <>
            {activeTab === 'home' && <HomeScreen availableOrders={availableOrders} onAccept={handleAccept} />}
            {activeTab === 'myorders' && <MyOrdersScreen myOrders={myOrders} onOpen={handleOpenOrder} />}
            {activeTab === 'history' && <HistoryScreen history={history} totalEarnings={earnings} />}
            {activeTab === 'profile' && <ProfileScreen isOnline={isOnline} toggleOnline={() => setIsOnline(!isOnline)} />}
          </>
        )}
      </main>

      {/* BOTTOM NAV */}
      <nav className="bg-white border-t flex justify-around p-2 pb-6 fixed bottom-0 w-full max-w-md z-20">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">🏠</span><span className="text-[10px] font-bold">FEED</span>
        </button>
        <button onClick={() => setActiveTab('myorders')} className={`flex flex-col items-center p-2 relative ${activeTab === 'myorders' ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className="relative">
             <span className="text-xl">🎒</span>
             {myOrders.length > 0 && <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] flex items-center justify-center">{myOrders.length}</span>}
          </div>
          <span className="text-[10px] font-bold">MY ORDERS</span>
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center p-2 ${activeTab === 'history' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">💰</span><span className="text-[10px] font-bold">EARNINGS</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-blue-600' : 'text-gray-400'}`}>
          <span className="text-xl">👤</span><span className="text-[10px] font-bold">PROFILE</span>
        </button>
      </nav>
    </div>
  );
}