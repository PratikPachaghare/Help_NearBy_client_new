import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 1. Main Header (Upper Bar) */}
      <header className="bg-blue-600 text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
          
          {/* Logo Section */}
          <div className="flex flex-col items-start leading-none italic font-bold flex-shrink-0 cursor-pointer">
            <span className="text-xl">HelpNearBy</span>
            <span className="text-[10px] text-yellow-400 flex items-center">
              Plus <span className="ml-1 text-white">✦</span>
            </span>
          </div>

          {/* 2. Direct Navigation Sections (In Upper Bar) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 flex-1 justify-center">
            <NavLink 
              to="/grocery" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${isActive ? 'bg-blue-700 shadow-inner text-yellow-400' : 'hover:bg-blue-500'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/3724/3724720.png" alt="" className="w-5 h-5 brightness-200" />
              <span>Grocery</span>
            </NavLink>

            <NavLink 
              to="/worker" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${isActive ? 'bg-blue-700 shadow-inner text-yellow-400' : 'hover:bg-blue-500'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/1546/1546524.png" alt="" className="w-5 h-5 brightness-200" />
              <span>Worker</span>
            </NavLink>

            <NavLink 
              to="/medical" 
              className={({ isActive }) => 
                `flex items-center gap-2 px-4 py-2 rounded-md transition-all font-medium ${isActive ? 'bg-blue-700 shadow-inner text-yellow-400' : 'hover:bg-blue-500'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="" className="w-5 h-5 brightness-200" />
              <span>Medical</span>
            </NavLink>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4 font-semibold flex-shrink-0">
            {/* Mobile Search Icon (Optional) */}
            <div className="md:hidden">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            
            <button className="bg-white text-blue-600 px-6 py-1.5 rounded-sm text-sm hover:bg-gray-100 transition-colors">
              Login
            </button>
            
            <button className="bg-white text-blue-600 px-6 py-1.5 rounded-sm text-sm hover:bg-gray-100 transition-colors">
              Register
            </button>
            
           
          </div>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Is Outlet mein GroceryHome, WorkerHome etc. render honge */}
        <Outlet />
      </main>
    </div>
  );
}