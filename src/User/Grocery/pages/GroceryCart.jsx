import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productData } from './data'; // Using your raw data

export default function GroceryCart() {
  const navigate = useNavigate();
  
  // Simulating cart state with some raw data items
  const [cartItems, setCartItems] = useState([
    { ...productData.staples[0], qty: 1 },
    { ...productData.dailyNeeds[1], qty: 2 },
    { ...productData.snacks[0], qty: 1 },
  ]);

  const updateQty = (id, delta) => {
    setCartItems(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter(item => item.qty > 0));
  };

  const totalOriginalPrice = cartItems.reduce((acc, item) => acc + (item.oldPrice || Math.round(item.price * 1.4)) * item.qty, 0);
  const totalDiscountedPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const savings = totalOriginalPrice - totalDiscountedPrice;

  return (
    <div className="min-h-screen bg-[#F1F3F6] pb-10">
      {/* Small Sub-Header */}
      <div className="bg-white shadow-sm py-3 px-4 mb-4">
        <div className="max-w-6xl mx-auto flex gap-8 font-bold text-sm text-[#2874f0]">
          <span className="border-b-2 border-[#2874f0] pb-2 cursor-pointer">FreshMart (3)</span>
          <span className="text-gray-400 cursor-not-allowed">Grocery (0)</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 px-2">
        
        {/* Left Section: Items List */}
        <div className="flex-1">
          {/* Address Bar */}
          <div className="bg-white p-4 rounded-sm shadow-sm mb-4 flex justify-between items-center">
            <span className="text-sm">From Saved Address: <span className="font-bold">Mumbai 400001</span></span>
            <button className="border border-gray-200 text-[#2874f0] px-4 py-2 rounded-sm text-xs font-bold shadow-sm">Enter Pincode</button>
          </div>

          {/* Cart Items */}
          <div className="bg-white rounded-sm shadow-sm overflow-hidden">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-100 flex gap-6">
                {/* Image and Qty Toggle */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-28 h-28 flex items-center justify-center">
                    <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div className="flex items-center gap-0">
                    <button 
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center font-bold hover:bg-gray-50">-</button>
                    <input type="text" value={item.qty} readOnly className="w-10 text-center text-sm font-bold outline-none" />
                    <button 
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 border border-gray-300 rounded-full flex items-center justify-center font-bold hover:bg-gray-50">+</button>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                  <h3 className="text-md font-medium text-gray-900 line-clamp-1 hover:text-[#2874f0] cursor-pointer">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">{item.weight}</p>
                  <p className="text-xs text-gray-400 mb-2">Seller: FreshMart Retail</p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-gray-400 line-through text-sm">₹{(item.oldPrice || Math.round(item.price * 1.4)) * item.qty}</span>
                    <span className="text-lg font-bold">₹{item.price * item.qty}</span>
                    <span className="text-green-600 text-xs font-bold">{item.discount || '20% Off'}</span>
                  </div>

                  <div className="flex gap-4">
                    <button className="text-sm font-bold uppercase hover:text-[#2874f0]">Save for later</button>
                    <button 
                      onClick={() => updateQty(item.id, -item.qty)}
                      className="text-sm font-bold uppercase hover:text-red-500">Remove</button>
                  </div>
                </div>

                <div className="text-xs font-bold w-32">
                  Delivery by Tomorrow | <span className="text-green-600 font-normal">Free</span>
                </div>
              </div>
            ))}

            {/* Sticky Place Order Button */}
            <div className="p-4 flex justify-end bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] sticky bottom-0">
              <button className="bg-[#fb641b] text-white px-12 py-3 rounded-sm font-bold text-sm shadow-md uppercase">
                Place Order
              </button>
            </div>
          </div>
        </div>

        {/* Right Section: Price Details */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-sm shadow-sm sticky top-24">
            <h3 className="text-gray-500 font-bold uppercase text-sm p-4 border-b border-gray-100">Price Details</h3>
            
            <div className="p-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{totalOriginalPrice}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Discount</span>
                <span className="text-green-600">- ₹{savings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Charges</span>
                <span className="text-green-600">FREE</span>
              </div>
              
              <div className="flex justify-between text-lg font-bold border-t border-dashed border-gray-200 pt-4 mt-2">
                <span>Total Amount</span>
                <span>₹{totalDiscountedPrice}</span>
              </div>
              
              <div className="text-green-600 font-bold text-sm pt-2">
                You will save ₹{savings} on this order
              </div>
            </div>

            <div className="p-4 flex items-center gap-2 text-[11px] text-gray-500 font-bold border-t border-gray-100 uppercase">
              🛡️ Safe and Secure Payments. Easy returns.
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}