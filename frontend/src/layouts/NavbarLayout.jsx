import React from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { FaUserCircle, FaPowerOff, FaStore } from "react-icons/fa";

const Navbar = () => {
  const { isLogin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `relative py-2 px-1 text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
      isActive 
        ? "text-red-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-red-600" 
        : "text-gray-500 hover:text-red-600"
    }`;

  return (
    /* h-screen এর সাথে w-full এবং overflow-x-hidden যোগ করা হয়েছে যাতে সাইড স্ক্রল না আসে */
    <div className="h-screen w-full flex flex-col overflow-x-hidden font-sans bg-[#FBFBFB]">
      
      {/* ইনলাইন সিএসএস যা এই পেজ এবং এর চাইল্ড পেজগুলোর স্ক্রলবার হাইড করবে */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none !important; }
        .no-scrollbar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        /* পুরো বডি থেকে হরাইজন্টাল স্ক্রল ব্লক */
        body { overflow-x: hidden !important; width: 100%; }
      `}</style>

      <nav className="bg-white border-b border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] shrink-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-black italic text-xl shadow-lg shadow-red-200 group-hover:rotate-6 transition-transform">
              M
            </div>
            <div className="leading-tight">
              <span className="block text-lg font-black text-gray-900 tracking-tighter">MY<span className="text-red-600">APP</span></span>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em]">POS System</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-10">
            <div className="hidden md:flex items-center gap-8">
              <NavLink to="/" className={linkClass}>Home</NavLink>
              {isLogin && user.role?.toUpperCase() === "ADMIN" && (
                <NavLink to="/admin/dashboard" className={linkClass}>Admin Panel</NavLink>
              )}
            </div>

            <div className="h-8 w-[1px] bg-gray-100 hidden md:block"></div>

            {/* Auth Section */}
            {!isLogin ? (
              <div className="flex items-center gap-4">
                <NavLink to="/login" className="text-[11px] font-black text-gray-500 uppercase hover:text-red-600 transition-colors">
                  Login
                </NavLink>
                <NavLink to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:shadow-lg hover:shadow-red-200 transition-all active:scale-95">
                  Get Started
                </NavLink>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                {/* User Info Card */}
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-100">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-gray-900 leading-none uppercase">
                      {user?.userName || user?.email?.split('@')[0]}
                    </p>
                    <p className="text-[8px] font-bold text-red-500 uppercase tracking-tighter mt-1">
                      {user.role || 'User'}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm">
                    <FaUserCircle size={20} />
                  </div>
                </div>

                {/* Salesman POS Button */}
                {user.role?.toUpperCase() === "SALESMAN" && (
                  <NavLink to="/salesman/dashboard" className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-md shadow-red-100 hover:bg-red-700 transition-all active:scale-95">
                    <FaStore size={12} /> POS Mode
                  </NavLink>
                )}

                {/* Logout Button */}
                <button 
                  onClick={handleLogout} 
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all group"
                  title="Logout"
                >
                  <FaPowerOff size={16} className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area - no-scrollbar ক্লাস অ্যাড করা হয়েছে */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;