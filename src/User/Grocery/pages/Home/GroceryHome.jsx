import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories, productData } from '../data';

const ProductCard = ({ product }) => {
  const [qty, setQty] = useState(0);
  const navigate = useNavigate();

  // Function to navigate to details page
  const handleCardClick = () => {
    navigate(`product/${product.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="min-w-[170px] max-w-[180px] bg-white flex flex-col group cursor-pointer transition-transform duration-200"
    >
      {/* Top Image Section with Badges */}
      <div className="relative aspect-square bg-[#F9F9F9] rounded-xl overflow-hidden border border-gray-100 mb-2">
        {/* Discount Badge */}
        <div className="absolute top-0 left-0 bg-[#00813D] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-br-md z-10 flex items-center">
          <span className="mr-0.5 text-[8px]">↓</span>{product.discount || '20%'}
        </div>

        {product.isAd && (
          <div className="absolute top-2 right-2 bg-gray-400/20 backdrop-blur-sm text-[9px] text-gray-500 px-1 rounded font-bold uppercase">
            Ad
          </div>
        )}

        <div className="w-full h-full p-3 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name} 
            className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
          />
        </div>

        {/* Rating Badge */}
        <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded border border-gray-100 flex items-center gap-1 shadow-sm">
          <span className="text-[11px] font-bold text-gray-800">{product.rating || '4.2'}</span>
          <span className="text-green-600 text-[10px]">★</span>
        </div>

        {/* Action Button */}
        <div className="absolute bottom-1 right-1">
          {qty === 0 ? (
            <button 
              onClick={(e) => { 
                e.stopPropagation(); // Prevents navigation to details page
                setQty(1); 
              }}
              className="w-9 h-9 flex items-center justify-center bg-white border border-[#A16207] text-[#A16207] rounded-xl shadow-lg hover:bg-orange-50 transition-colors"
            >
              <span className="text-2xl font-light">+</span>
            </button>
          ) : (
            <div className="flex items-center bg-[#A16207] text-white rounded-xl shadow-lg h-9 px-2">
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevents navigation to details page
                  setQty(qty - 1); 
                }} 
                className="px-1 text-lg font-bold"
              >
                -
              </button>
              <span className="px-2 font-bold text-sm">{qty}</span>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); // Prevents navigation to details page
                  setQty(qty + 1); 
                }} 
                className="px-1 text-lg font-bold"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="px-1 flex flex-col gap-1">
        <div className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded w-max">
          {product.weight}
        </div>

        <h3 className="text-[13px] font-medium text-gray-800 line-clamp-2 leading-tight min-h-[32px]">
          {product.name}
        </h3>

        <div className="flex items-center mt-1">
          <div className="flex border border-yellow-400 rounded-md overflow-hidden bg-white shadow-sm">
            <span className="bg-[#FFD814] px-2 py-0.5 text-[14px] font-black text-gray-900">
              ₹{product.price}
            </span>
            <span className="px-2 py-0.5 text-[12px] text-gray-400 line-through flex items-center">
              ₹{product.oldPrice || Math.round(product.price * 1.3)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionRow = ({ title, products }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
        {title}
      </h2>
      <button className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md">
        <span className="text-sm">➔</span>
      </button>
    </div>
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 px-1">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

export default function GroceryHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      {/* Header */}
<header className="bg-[#2874f0] py-2 px-3 sticky top-20 z-50 shadow-md rounded-md">
  <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
    
    {/*
    <div 
      onClick={() => navigate('/')} 
      className="flex flex-col text-white font-bold italic cursor-pointer min-w-max"
    >
      <span className="text-xl leading-none tracking-tight">FreshMart</span>
      <span className="text-[10px] text-yellow-400 flex items-center">
        Explore <span className="text-white ml-0.5">Plus</span>
        <span className="ml-0.5 text-yellow-400">✦</span>
      </span>
    </div> */}

    {/* Search Bar - Now smaller with integrated button */}
    <div className="flex-1 max-w-[550px] rounded-md relative flex items-center group">
      <input 
        type="text" 
        className="w-full py-3 px-4 pr-12 rounded-sm outline-none text-[13px] shadow-sm placeholder-gray-500 focus:shadow-md transition-shadow" 
        placeholder="Search for groceries, staples and more" 
      />
      <button className="absolute right-0 h-full px-4 text-[#2874f0] hover:bg-blue-50 transition-colors">
        <span className="text-lg">🔍</span>
      </button>
    </div>

    {/* Navigation Links */}
    <div className="flex items-center gap-8 text-white">
      
      {/* Home */}
      <div 
        onClick={() => navigate('/')}
        className="flex flex-col items-center cursor-pointer group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🏠</span>
        <span className="text-[11px] font-bold">Home</span>
      </div>

      {/* Cart */}
      <div 
        onClick={() => navigate('/grocery/cart')}
        className="flex flex-col items-center cursor-pointer group relative"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">🛒</span>
        <span className="text-[11px] font-bold">Cart</span>
        {/* Cart Count Badge */}
        <span className="absolute -top-1 -right-2 bg-[#ff6161] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-[#2874f0]">
          3
        </span>
      </div>

      {/* Orders */}
      <div 
        onClick={() => navigate('/grocery/myOrders')}
        className="flex flex-col items-center cursor-pointer group"
      >
        <span className="text-xl group-hover:scale-110 transition-transform">📦</span>
        <span className="text-[11px] font-bold">Orders</span>
      </div>

    </div>
  </div>
</header>

      {/* Category Icons Bar */}
      <nav className="bg-white shadow-sm border-b overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex justify-between p-4 gap-4">
          {categories.map((cat, i) => (
            <div key={i} className="flex flex-col items-center min-w-[70px] cursor-pointer group">
              <div className="w-14 h-14 bg-[#f0f5ff] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[12px] font-bold mt-2 text-gray-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 mt-6">
        
        {/* Banner Section */}
        <section className="w-full bg-gradient-to-r from-blue-700 to-blue-500 rounded-sm mb-8 overflow-hidden relative shadow-lg h-44 flex items-center">
             <div className="p-8 text-white z-10">
                <h1 className="text-4xl font-black italic">UP TO 60% OFF</h1>
                <p className="text-lg font-bold opacity-90">Stock up on your Monthly Ration</p>
                <button className="mt-4 bg-yellow-400 text-blue-900 px-8 py-2 rounded-sm font-black text-sm uppercase shadow-md active:scale-95 transition-transform">
                  Shop Now
                </button>
             </div>
             <div className="absolute right-[-20px] bottom-[-20px] text-[12rem] opacity-20 rotate-12 pointer-events-none">🛒</div>
        </section>

        {/* Product Rows mapped from data.js */}
        <SectionRow title="Daily Cooking Essentials" products={productData.staples} />
        <SectionRow title="Milk & Dairy Essentials" products={productData.dailyNeeds} />
        <SectionRow title="Snacks " products={productData.snacks} />
        {/* <SectionRow title="Cleaning Essentials" products={productData.staples} /> */}

      </main>
    </div>
  );
}