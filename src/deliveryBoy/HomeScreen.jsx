import React from 'react';

export const HomeScreen = ({ availableOrders, onAccept }) => {
  return (
    <div className="p-4 pb-20">
      <h2 className="text-xl font-bold mb-4 text-gray-800">New Requests ({availableOrders.length})</h2>
      
      {availableOrders.map(order => (
        <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4 overflow-hidden relative">
          
          {/* Header: Earnings & Timer */}
          <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-100">
            <div>
              <span className="text-green-700 font-black text-xl">₹{order.price + order.tip}</span>
              {order.tip > 0 && <span className="text-[10px] text-gray-500 ml-1">(inc. ₹{order.tip} tip)</span>}
            </div>
            <div className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
              ⏱️ {order.time} to pickup
            </div>
          </div>

          <div className="p-4">
            {/* 1. PICKUP SECTION */}
            <div className="flex items-start gap-3 mb-4 relative">
               {/* Timeline Line */}
               <div className="absolute left-[9px] top-6 bottom-[-20px] w-0.5 bg-gray-200"></div>
               
               <div className="w-5 h-5 rounded-full bg-orange-100 border-2 border-orange-500 flex items-center justify-center z-10">
                 <span className="text-[10px] font-bold text-orange-600">S</span>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between">
                   <h3 className="font-bold text-sm text-gray-800">{order.shopName}</h3>
                   <span className="text-xs font-bold text-orange-600">{order.shopDist} away</span>
                 </div>
                 <p className="text-xs text-gray-500 truncate">{order.shopAddress}</p>
               </div>
            </div>

            {/* 2. DROP SECTION */}
            <div className="flex items-start gap-3 mb-4">
               <div className="w-5 h-5 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center z-10">
                 <span className="text-[10px] font-bold text-blue-600">C</span>
               </div>
               <div className="flex-1">
                 <div className="flex justify-between">
                   <h3 className="font-bold text-sm text-gray-800">{order.customerName}</h3>
                   <span className="text-xs font-bold text-blue-600">{order.custDist} trip</span>
                 </div>
                 <p className="text-xs text-gray-500 truncate">{order.customerAddress}</p>
               </div>
            </div>

            {/* ACTION */}
            <div className="mt-2 pt-3 border-t flex justify-between items-center">
               <span className="text-xs text-gray-400">{order.paymentMethod} • {order.items}</span>
               <button 
                 onClick={() => onAccept(order)}
                 className="bg-black text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg active:scale-95 transition-transform">
                 Accept Order
               </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};