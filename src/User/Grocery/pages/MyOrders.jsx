import React from 'react';
import { useNavigate } from 'react-router-dom';
import { productData } from './data';

export default function Orders() {
  const navigate = useNavigate();

  // Simulating order history using your raw data
  const orderHistory = [
    { 
      id: "OD123456789", 
      items: [productData.staples[0]], 
      status: "Delivered", 
      date: "Feb 02, 2026", 
      statusColor: "bg-green-500" 
    },
    { 
      id: "OD987654321", 
      items: [productData.dailyNeeds[1]], 
      status: "On the way", 
      date: "Expected by tomorrow", 
      statusColor: "bg-blue-500" 
    },
    { 
      id: "OD556677889", 
      items: [productData.snacks[2]], 
      status: "Cancelled", 
      date: "Jan 28, 2026", 
      statusColor: "bg-red-500" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#F1F3F6] pb-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4">
        
        {/* Left Sidebar: Filters */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white shadow-sm rounded-sm p-4 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Order Status</p>
                {['On the way', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
                  <label key={status} className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#2874f0]" />
                    {status}
                  </label>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-xs font-bold uppercase text-gray-500 mb-2">Order Time</p>
                {['Last 30 days', '2025', '2024', 'Older'].map((time) => (
                  <label key={time} className="flex items-center gap-2 text-sm text-gray-700 mb-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-[#2874f0]" />
                    {time}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Orders List */}
        <div className="flex-1 space-y-3">
          
          {/* Search Orders Bar */}
          <div className="flex gap-0 mb-4">
            <input 
              type="text" 
              placeholder="Search your orders here" 
              className="flex-1 p-2.5 outline-none text-sm border border-gray-300 rounded-l-sm focus:border-[#2874f0]"
            />
            <button className="bg-[#2874f0] text-white px-6 py-2 rounded-r-sm font-bold text-sm flex items-center gap-2">
              🔍 Search Orders
            </button>
          </div>

          {/* Individual Order Cards */}
          {orderHistory.map((order) => (
            <div 
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="bg-white border border-gray-200 rounded-sm p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Product Image */}
              <div className="w-20 h-20 shrink-0">
                <img 
                  src={order.items[0].image} 
                  alt="" 
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Title & Info */}
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                  {order.items[0].name}
                </h4>
                <p className="text-xs text-gray-400 mt-1">Weight: {order.items[0].weight}</p>
                <p className="text-xs text-gray-400">Order ID: {order.id}</p>
              </div>

              {/* Price */}
              <div className="w-24 text-sm font-bold text-gray-900">
                ₹{order.items[0].price}
              </div>

              {/* Status & Tracking */}
              <div className="w-full md:w-56">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${order.statusColor}`}></span>
                  <span className="text-sm font-bold text-gray-800">{order.status} on {order.date}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 ml-4 italic">Your item has been {order.status.toLowerCase()}</p>
                
                {order.status === "Delivered" && (
                  <div className="flex items-center gap-1 mt-2 ml-4 text-[#2874f0] text-xs font-bold">
                    <span>★</span>
                    <span>Rate & Review Product</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {orderHistory.length === 0 && (
            <div className="bg-white p-20 text-center rounded-sm shadow-sm">
              <img 
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/myorders-empty_f9f973.png" 
                alt="Empty" 
                className="w-64 mx-auto mb-4"
              />
              <p className="text-lg font-bold">You haven't placed any orders yet!</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-4 bg-[#2874f0] text-white px-10 py-2 font-bold rounded-sm shadow-md"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}