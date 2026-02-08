import React from 'react';

export const ProfileScreen = ({ isOnline, toggleOnline }) => (
  <div className="p-4">
    {/* HEADER */}
    <div className="flex items-center gap-4 mb-6">
      <div className="h-16 w-16 bg-gray-200 rounded-full border-2 border-white shadow flex items-center justify-center text-2xl">👤</div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold">Raju Rider</h2>
        <div className="flex gap-2 text-sm text-gray-500">
           <span>ID: DL-2024-X</span>
           <span>•</span>
           <span className="text-yellow-600 font-bold">⭐ 4.8</span>
        </div>
      </div>
    </div>

    {/* DUTY TOGGLE */}
    <div className={`p-4 rounded-xl shadow mb-6 flex justify-between items-center border ${isOnline ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
      <div>
        <p className="font-bold text-gray-800">Duty Status</p>
        <p className={`text-sm ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
          {isOnline ? 'You are receiving orders' : 'You are currently offline'}
        </p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" checked={isOnline} onChange={toggleOnline} />
        <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
      </label>
    </div>

    {/* STATS GRID */}
    <div className="grid grid-cols-3 gap-3 mb-6">
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Orders</p>
          <p className="font-bold text-xl">142</p>
       </div>
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Hours</p>
          <p className="font-bold text-xl">45h</p>
       </div>
       <div className="bg-white p-3 rounded-lg shadow-sm text-center border border-gray-100">
          <p className="text-xs text-gray-400">Reject</p>
          <p className="font-bold text-xl text-red-500">2%</p>
       </div>
    </div>

    {/* VEHICLE INFO */}
    <h3 className="font-bold text-gray-800 mb-3">Vehicle Details</h3>
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
       <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-gray-500">Model</span>
          <span className="font-medium">Honda Activa 6G</span>
       </div>
       <div className="flex justify-between py-2 border-b border-gray-50">
          <span className="text-gray-500">Plate Number</span>
          <span className="font-medium">MH-12-AB-1234</span>
       </div>
       <div className="flex justify-between py-2">
          <span className="text-gray-500">Insurance Exp</span>
          <span className="font-medium text-green-600">Dec 2024</span>
       </div>
    </div>

    <button className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold border border-red-100">Log Out</button>
  </div>
);