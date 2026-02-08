import React, { useState, useEffect } from 'react';


export const BillingScreen = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  return (
    <div className="p-4 flex gap-4">
      <div className="w-1/2">
        <h2 className="text-2xl font-bold mb-4">🧾 Generate Invoice</h2>
        <p className="mb-2">Select a completed order to generate bill:</p>
        <ul className="border rounded">
          {orders.map(o => (
            <li 
              key={o.id} 
              onClick={() => setSelectedOrder(o)}
              className="p-3 border-b hover:bg-gray-100 cursor-pointer flex justify-between">
              <span>#{o.id} - {o.product}</span>
              <span>₹{o.total}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-1/2 bg-white border-2 border-dashed border-gray-300 p-6 rounded-lg min-h-[300px]">
        {selectedOrder ? (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold uppercase">Tax Invoice</h1>
              <p className="text-sm text-gray-500">My Super Shop</p>
            </div>
            <div className="mb-4">
              <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
            <table className="w-full mb-4">
              <tr className="border-b">
                <td className="py-2">Item</td>
                <td className="text-right">Amt</td>
              </tr>
              <tr>
                <td className="py-2">{selectedOrder.product} (x{selectedOrder.qty})</td>
                <td className="text-right">₹{selectedOrder.total}</td>
              </tr>
              <tr className="font-bold border-t">
                <td className="py-2">Total</td>
                <td className="text-right">₹{selectedOrder.total}</td>
              </tr>
            </table>
            <button 
              onClick={() => window.print()}
              className="w-full bg-gray-800 text-white py-2 mt-4 rounded">
              Print Bill
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">Select an order</div>
        )}
      </div>
    </div>
  );
};