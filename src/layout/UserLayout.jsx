import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

export default function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-50 border-b border-[#d9e6ec] bg-white/95 backdrop-blur-md shadow-[0_6px_24px_rgba(7,44,63,0.08)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col items-start leading-none font-bold shrink-0 cursor-pointer">
            <span className="text-xl text-[#0f3d4c] tracking-wide">HelpNearBy</span>
            <span className="text-[10px] text-[#5e7680] uppercase tracking-[0.2em]">Structured Local Service Network</span>
          </div>

          <nav className="flex items-center gap-2 lg:gap-3 rounded-full border border-[#d7e6ec] bg-[#f4f8fa] p-1.5">
            <NavLink
              to="/grocery"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[#0f3d4c] text-white shadow-[0_4px_14px_rgba(15,61,76,0.25)]' : 'text-[#385867] hover:bg-white'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/3724/3724720.png" alt="" className="w-4 h-4" />
              <span>Grocery</span>
            </NavLink>

            <NavLink
              to="/worker"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[#0f3d4c] text-white shadow-[0_4px_14px_rgba(15,61,76,0.25)]' : 'text-[#385867] hover:bg-white'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/1546/1546524.png" alt="" className="w-4 h-4" />
              <span>Worker</span>
            </NavLink>

            <NavLink
              to="/medical"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold transition ${isActive ? 'bg-[#0f3d4c] text-white shadow-[0_4px_14px_rgba(15,61,76,0.25)]' : 'text-[#385867] hover:bg-white'}`
              }
            >
              <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="" className="w-4 h-4" />
              <span>Medical</span>
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 font-semibold shrink-0">
            {user ? (
              <>
                <span className="text-xs bg-[#eff6f9] text-[#27414d] px-3 py-1.5 rounded-full border border-[#d7e6ec]">
                  {user.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-[#0f3d4c] text-white px-4 py-1.5 rounded-md text-sm hover:bg-[#14566c] transition-colors"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}