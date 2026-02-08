import React from 'react';

export const MyOrdersScreen = ({ myOrders, onOpen }) => (
  <div className="p-4 pb-20">
    <h2 className="text-xl font-bold mb-4 text-gray-800">My Bag ({myOrders.length})</h2>
    
    {myOrders.length === 0 ? (
      <div className="text-center py-20 text-gray-400">
        <span className="text-4xl block mb-2">🎒</span>
        No active orders.
      </div>
    ) : (
      myOrders.map(order => (
        <div 
          key={order.id} 
          onClick={() => onOpen(order.id)}
          className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 mb-3 cursor-pointer hover:shadow-md transition-all">
          
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded uppercase">{order.status}</span>
            <span className="font-bold text-gray-800">#{order.id}</span>
          </div>
          
          <div className="flex justify-between items-center">
             <div>
                <h3 className="font-bold text-sm">{order.shopName}</h3>
                <p className="text-xs text-gray-500">to {order.customerName}</p>
             </div>
             <div className="text-right">
                <span className="text-blue-600 font-bold text-sm">Open Details →</span>
             </div>
          </div>
        </div>
      ))
    )}
  </div>
);