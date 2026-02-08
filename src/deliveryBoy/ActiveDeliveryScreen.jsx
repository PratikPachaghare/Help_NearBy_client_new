import React, { useState } from 'react';

export const ActiveOrderScreen = ({ order, onBack, onUpdateStatus }) => {
  const [otp, setOtp] = useState('');

  // Stepper UI helper
  const getStepColor = (s) => order.step >= s ? 'bg-green-500' : 'bg-gray-200';

  const handleAction = () => {
    if (order.step === 1) onUpdateStatus(order.id, 'Arrived at Shop', 2);
    else if (order.step === 2) onUpdateStatus(order.id, 'Out for Delivery', 3);
    else if (order.step === 3) onUpdateStatus(order.id, 'Arrived at Location', 4);
    else if (order.step === 4) {
      if(otp !== order.otp) return alert("❌ Incorrect OTP");
      onUpdateStatus(order.id, 'COMPLETED', 5);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* NAV BAR */}
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 z-10">
        <button onClick={onBack} className="text-2xl font-bold text-gray-600">←</button>
        <div>
           <h2 className="font-bold text-lg">Order #{order.id}</h2>
           <p className="text-xs text-green-600 font-bold uppercase">{order.status}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 bg-gray-50">
         
         {/* STEPPER */}
         <div className="flex items-center gap-1 mb-6 mt-2">
            <div className={`h-1 flex-1 rounded ${getStepColor(1)}`}></div>
            <div className={`h-1 flex-1 rounded ${getStepColor(2)}`}></div>
            <div className={`h-1 flex-1 rounded ${getStepColor(3)}`}></div>
            <div className={`h-1 flex-1 rounded ${getStepColor(4)}`}></div>
         </div>

         {/* DETAILS CARD */}
         <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
            <div className="mb-4 pb-4 border-b border-dashed">
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Pickup from Shop</p>
               <h3 className="font-bold text-lg">{order.shopName}</h3>
               <p className="text-sm text-gray-500">{order.shopAddress}</p>
               <div className="flex gap-2 mt-2">
                  <button onClick={() => window.open(`google.navigation:q=${order.shopAddress}`)} className="bg-orange-50 text-orange-600 px-3 py-1 rounded text-xs font-bold border border-orange-100">Navigate Shop</button>
                  <button className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">Call</button>
               </div>
            </div>

            <div>
               <p className="text-xs text-gray-400 font-bold uppercase mb-1">Deliver to Customer</p>
               <h3 className="font-bold text-lg">{order.customerName}</h3>
               <p className="text-sm text-gray-500">{order.customerAddress}</p>
               <div className="bg-yellow-50 p-2 rounded mt-2 text-xs text-gray-600">
                  <strong>Items:</strong> {order.items}
               </div>
               <div className="flex gap-2 mt-3">
                  <button onClick={() => window.open(`google.navigation:q=${order.customerAddress}`)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-xs font-bold border border-blue-100">Navigate User</button>
                  <button className="bg-gray-100 px-3 py-1 rounded text-xs font-bold">Call</button>
               </div>
            </div>
         </div>

         {/* OTP INPUT (Only at final step) */}
         {order.step === 4 && (
            <div className="bg-white p-4 rounded-xl shadow border-2 border-green-500 text-center animate-pulse">
               <p className="font-bold text-gray-700 mb-2">Enter OTP to Complete</p>
               <input 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="X X X X"
                  maxLength={4}
                  className="text-center text-2xl font-bold tracking-widest w-32 border-b-2 border-gray-300 outline-none"
               />
            </div>
         )}
      </div>

      {/* ACTION BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t max-w-md mx-auto">
         <button 
            onClick={handleAction}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg
               ${order.step === 4 ? 'bg-green-600' : 'bg-black'}`}>
            {order.step === 1 && "Confirm Arrival at Shop"}
            {order.step === 2 && "Order Picked Up"}
            {order.step === 3 && "Arrived at Customer Location"}
            {order.step === 4 && "Verify OTP & Finish"}
         </button>
      </div>
    </div>
  );
};