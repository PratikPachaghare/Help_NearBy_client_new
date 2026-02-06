import React from 'react';

const medicalCategories = [
  { id: 1, name: "Medicines", img: "https://cdn-icons-png.flaticon.com/512/2864/2864787.png" },
  { id: 2, name: "Wellness", img: "https://cdn-icons-png.flaticon.com/512/2966/2966327.png" },
  { id: 3, name: "Lab Tests", img: "https://cdn-icons-png.flaticon.com/512/2782/2782861.png" },
  { id: 4, name: "Ayurveda", img: "https://cdn-icons-png.flaticon.com/512/822/822143.png" },
  { id: 5, name: "Personal Care", img: "https://cdn-icons-png.flaticon.com/512/2553/2553642.png" },
];

const medicineData = [
  { id: 1, name: "Paracetamol 650mg", brand: "Dolo", price: 30, mrp: 45, discount: "33% OFF", img: "https://5.imimg.com/data5/SELLER/Default/2022/9/MQ/XU/XN/150064344/dolo-650-tablet-500x500.jpg", type: "Tablet" },
  { id: 2, name: "Multivitamin Gold", brand: "Revital", price: 280, mrp: 350, discount: "20% OFF", img: "https://m.media-amazon.com/images/I/61Uun8X8k9L._AC_UF1000,1000_QL80_.jpg", type: "Capsule" },
  { id: 3, name: "Hand Sanitizer 500ml", brand: "Dettol", price: 199, mrp: 250, discount: "20% OFF", img: "https://m.media-amazon.com/images/I/51+u7D+QWpL.jpg", type: "Liquid" },
  { id: 4, name: "Vicks Vaporub 50g", brand: "Vicks", price: 145, mrp: 160, discount: "10% OFF", img: "https://m.media-amazon.com/images/I/719hLpNoL7L.jpg", type: "Ointment" },
  { id: 5, name: "Digital Thermometer", brand: "Dr. Trust", price: 250, mrp: 499, discount: "50% OFF", img: "https://m.media-amazon.com/images/I/61mDOf-Xq3L.jpg", type: "Device" },
  { id: 6, name: "Face Mask N95", brand: "Wildcraft", price: 120, mrp: 200, discount: "40% OFF", img: "https://m.media-amazon.com/images/I/61u957xXn6L.jpg", type: "Safety" },
];

export default function MedicalHome() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* 1. Prescription Upload Banner */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-600 rounded-2xl p-6 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold">Quick Order with Prescription</h2>
            <p className="text-blue-100 mt-1 text-sm md:text-base">Upload your doctor's note and we'll handle the rest!</p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            Upload Now
          </button>
        </div>
      </div>

      {/* 2. Top Categories Section */}
      <div className="max-w-7xl mx-auto px-4 mt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Shop by Category</h3>
        <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4">
          {medicalCategories.map((cat) => (
            <div key={cat.id} className="flex flex-col items-center min-w-[100px] cursor-pointer group">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center group-hover:shadow-md transition-all group-hover:-translate-y-1">
                <img src={cat.img} alt={cat.name} className="w-12 h-12 object-contain" />
              </div>
              <span className="text-sm font-semibold text-gray-700 mt-3">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Medicine Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-gray-800 tracking-tight">Best Sellers & Offers</h3>
          <button className="text-blue-600 font-bold text-sm hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
          {medicineData.map((item) => (
            <div key={item.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col group h-full">
              {/* Product Image */}
              <div className="relative p-4 h-40 flex items-center justify-center bg-gray-50/50">
                <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {item.discount}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] uppercase font-bold text-blue-500 mb-1">{item.type}</span>
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight h-10">{item.name}</h4>
                <p className="text-xs text-gray-400 mt-1">By {item.brand}</p>
                
                <div className="mt-auto pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-gray-900">₹{item.price}</span>
                    <span className="text-xs text-gray-400 line-through">₹{item.mrp}</span>
                  </div>
                  <button className="mt-3 w-full border-2 border-blue-600 text-blue-600 font-bold py-1.5 rounded-lg text-sm hover:bg-blue-600 hover:text-white transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}