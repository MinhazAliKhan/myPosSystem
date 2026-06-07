import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { FaTachometerAlt, FaUnlockAlt, FaLock, FaShoppingCart, FaHistory, FaUserCircle, FaTrashAlt, FaWallet } from "react-icons/fa";

const UserProfile = () => {
  const { user } = useAuth();

  const activeLink = "bg-red-600 text-white p-4 rounded-xl flex items-center gap-3 font-bold shadow-md shrink-0";
  const normalLink = "text-slate-300 hover:bg-slate-700 p-4 rounded-xl flex items-center gap-3 shrink-0 transition-all";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-100 font-sans text-gray-800">
      
      <aside className="w-64 bg-slate-800 flex flex-col p-4 shrink-0 shadow-2xl z-20">
        <div className="py-8 text-center border-b border-slate-700 mb-6 shrink-0">
          <h1 className="text-xl font-black text-white italic tracking-tighter">POS TERMINAL</h1>
          <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-1">Management Suite</p>
        </div>
        
        <nav className="flex-1 space-y-2 overflow-y-auto pr-1 
          [&::-webkit-scrollbar]:w-1 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-slate-600">
          <NavLink to="/salesman/dashboard" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaTachometerAlt size={18} /> <span className="text-[11px] font-bold uppercase">Dashboard</span>
          </NavLink>
          <NavLink to="/salesman/open-shift" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaUnlockAlt size={18} /> <span className="text-[11px] font-bold uppercase">Open Shift</span>
          </NavLink>
          <NavLink to="/salesman/close-shift" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaLock size={18} /> <span className="text-[11px] font-bold uppercase">Close Shift</span>
          </NavLink>
          <NavLink to="/salesman/new-order" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaShoppingCart size={18} /> <span className="text-[11px] font-bold uppercase">New Order</span>
          </NavLink>

          {/* Expense Tab for Salesman */}
          <NavLink to="/salesman/expenses" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaWallet size={18} /> <span className="text-[11px] font-bold uppercase">Daily Expense</span>
          </NavLink>

          <NavLink to="/salesman/waste" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaTrashAlt size={18} /> <span className="text-[11px] font-bold uppercase">Record Waste</span>
          </NavLink>
          <NavLink to="/salesman/my-sales" className={({ isActive }) => isActive ? activeLink : normalLink}>
            <FaHistory size={18} /> <span className="text-[11px] font-bold uppercase">Sales History</span>
          </NavLink>
          <NavLink 
            to="/salesman/purchase" 
            className={({ isActive }) => isActive ? activeLink : normalLink}
          >
            <FaShoppingCart size={18} /> 
            <span className="text-[11px] font-bold uppercase">Purchase History</span>
          </NavLink>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 h-full relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8 justify-between shadow-sm shrink-0 z-10">
          <div className="flex items-center gap-3">
            <FaUserCircle className="text-gray-400" size={26} />
            <div>
              <h2 className="font-bold text-gray-700 text-sm uppercase">
                {user?.userName || user?.email || "Salesman"}
              </h2>
              <span className="text-[10px] font-bold text-green-600 uppercase">System Online</span>
            </div>
          </div>
          
          <div className="bg-gray-100 px-4 py-1.5 rounded-lg border border-gray-200">
             <span className="text-[10px] font-bold text-gray-500 uppercase">{new Date().toDateString()}</span>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 text-gray-800 
          [&::-webkit-scrollbar]:w-1.5 
          [&::-webkit-scrollbar]:h-1.5 
          [&::-webkit-scrollbar-track]:bg-transparent 
          [&::-webkit-scrollbar-thumb]:bg-gray-300 
          hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
          
          <div className="min-w-fit md:min-w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;