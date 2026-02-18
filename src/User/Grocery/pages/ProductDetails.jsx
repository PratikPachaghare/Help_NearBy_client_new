import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productData } from './data'; // Adjust path based on your file structure

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Search for the product across all category arrays in productData
    const allCategories = Object.values(productData);
    let found = null;
    
    for (const category of allCategories) {
      found = category.find(p => p.id === parseInt(id));
      if (found) break;
    }

    setProduct(found);
    window.scrollTo(0, 0); // Reset scroll position when viewing a new product
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] pb-12">
      <div className="max-w-[1248px] mx-auto pt-4 px-2">
        
        {/* Main Product Container */}
        <div className="flex flex-col md:flex-row bg-white rounded-sm shadow-sm">
          
          {/* Left: Sticky Image Section */}
          <div className="w-full md:w-[40%] p-4 border-r border-gray-100">
            <div className="sticky top-20">
              <div className="border border-gray-200 rounded-sm flex items-center justify-center h-[450px] p-4 group cursor-zoom-in">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110" 
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4">
                <button className="flex-1 bg-[#ff9f00] text-white h-14 rounded-sm font-bold text-lg shadow-sm hover:bg-[#fb9200] transition-colors">
                   🛒 ADD TO CART
                </button>
                <button className="flex-1 bg-[#fb641b] text-white h-14 rounded-sm font-bold text-lg shadow-sm hover:bg-[#f35a12] transition-colors">
                   ⚡ BUY NOW
                </button>
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="w-full md:w-[60%] p-6">
            <nav className="text-xs font-medium text-gray-500 mb-2 flex gap-1">
               Home <span className="text-gray-300">/</span> Grocery <span className="text-gray-300">/</span> {product.name}
            </nav>

            <h1 className="text-xl font-normal text-gray-900 mb-2 leading-tight">
              {product.name} ({product.weight})
            </h1>

            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-700 text-white text-[12px] font-bold px-1.5 py-0.5 rounded-sm flex items-center">
                {product.rating} ★
              </span>
              <span className="text-gray-500 text-sm font-bold">12,456 Ratings & 890 Reviews</span>
            </div>

            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              <span className="text-gray-500 line-through text-lg">₹{product.oldPrice || Math.round(product.price * 1.4)}</span>
              <span className="text-green-700 font-bold text-md">{product.discount || '20% off'}</span>
            </div>
            <p className="text-xs font-bold text-gray-400 mb-6">+ ₹5 Secured Packaging Fee</p>

            {/* Offers Section */}
            <div className="mb-8">
              <h3 className="font-bold text-gray-900 text-md mb-2">Available offers</h3>
              <div className="space-y-2">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-800">
                    <span className="text-green-600">🏷️</span>
                    <p><span className="font-bold">Bank Offer</span> 10% instant discount on Signature Bank Cards, up to ₹500 on orders of ₹2,500 and above <span className="text-blue-600 font-bold cursor-pointer">T&C</span></p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="flex items-center gap-10 border-y border-gray-100 py-6 mb-8">
              <div className="text-gray-500 font-bold text-sm w-24">Delivery</div>
              <div className="flex flex-col">
                <div className="flex items-center gap-4 border-b border-blue-600 w-max pb-1 mb-1">
                  <span className="text-sm font-bold">📍 400001</span>
                  <span className="text-blue-600 text-xs font-bold">Change</span>
                </div>
                <div className="text-sm font-bold">Delivery by tomorrow, Saturday | <span className="text-green-700">Free</span> <span className="text-gray-400 line-through">₹40</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Row */}
        <div className="mt-8 bg-white p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-900">Similar Products</h2>
             <button onClick={() => navigate('/')} className="bg-[#2874f0] text-white px-6 py-2 rounded-sm font-bold text-xs uppercase shadow-md">View All</button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {Object.values(productData).flat().slice(0, 8).map((item) => (
              <div 
                key={item.id} 
                onClick={() => navigate(`/grocery/product/${item.id}`)}
                className="min-w-[180px] max-w-[180px] cursor-pointer group p-2 border border-transparent hover:shadow-lg transition-all"
              >
                <div className="h-32 flex items-center justify-center mb-4">
                  <img src={item.image} alt={item.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1 mb-1">{item.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-bold">₹{item.price}</span>
                  <span className="text-green-700 text-[12px] font-bold">{item.discount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}