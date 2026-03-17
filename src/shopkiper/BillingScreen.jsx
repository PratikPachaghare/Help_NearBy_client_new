import React, { useState } from 'react';


export const BillingScreen = ({ orders }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const printInvoice = () => {
    window.print();
  };

  return (
    <div className="p-4 grid lg:grid-cols-2 gap-4">
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Generate Invoice</h2>
        <p className="mb-2 text-sm text-slate-500">Select an order to generate and print invoice:</p>
        <ul className="border border-slate-200 rounded-lg overflow-hidden">
          {orders.map((o) => (
            <li 
              key={o._id} 
              onClick={() => setSelectedOrder(o)}
              className="p-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer flex justify-between text-sm">
              <span>#{o.orderNumber}</span>
              <span>Rs {Math.round(o.grandTotal || 0)}</span>
            </li>
          ))}
          {!orders.length && <li className="p-3 text-sm text-slate-500">No orders available</li>}
        </ul>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-300 p-6 rounded-lg min-h-80">
        {selectedOrder ? (
          <div>
            <div className="text-center mb-6">
              <h1 className="text-xl font-bold uppercase">Tax Invoice</h1>
              <p className="text-sm text-gray-500">HelpNearBy Partner Store</p>
            </div>
            <div className="mb-4">
              <p><strong>Order ID:</strong> #{selectedOrder.orderNumber}</p>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Address:</strong> {selectedOrder.shippingAddress}</p>
            </div>
            <table className="w-full mb-4">
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Item</td>
                  <td className="text-right">Amt</td>
                </tr>
                {(selectedOrder.items || []).map((item, idx) => (
                  <tr key={`${item.productId || idx}`}>
                    <td className="py-2">{item.nameSnapshot} (x{item.qty})</td>
                    <td className="text-right">Rs {Math.round((item.price || 0) * (item.qty || 0))}</td>
                  </tr>
                ))}
                <tr className="font-bold border-t">
                  <td className="py-2">Total</td>
                  <td className="text-right">Rs {Math.round(selectedOrder.grandTotal || 0)}</td>
                </tr>
              </tbody>
            </table>
            <button 
              onClick={printInvoice}
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