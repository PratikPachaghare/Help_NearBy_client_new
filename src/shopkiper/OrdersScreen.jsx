// 3. ORDERS & NOTIFICATION COMPONENT
import React, { useState, useEffect } from 'react';

export const OrdersScreen = ({ orders, setOrders }) => {
  const markDispatched = (id) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: 'Dispatched' } : o));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🔔 Live Orders</h2>
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order.id} className={`p-4 rounded border flex justify-between items-center ${order.status === 'Pending' ? 'bg-orange-50 border-orange-200' : 'bg-white'}`}>
            <div>
              <h3 className="font-bold">Order #{order.id} - {order.product}</h3>
              <p className="text-sm text-gray-500">Qty: {order.qty} | Total: ₹{order.total} | Time: {order.time}</p>
            </div>
            <div>
              {order.status === 'Pending' ? (
                <button 
                  onClick={() => markDispatched(order.id)}
                  className="bg-green-600 text-white px-4 py-2 rounded shadow animate-pulse">
                  Order Lagva Do (Dispatch)
                </button>
              ) : (
                <span className="text-green-600 font-bold border border-green-600 px-3 py-1 rounded">✅ {order.status}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};