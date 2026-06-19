import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminProfile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const activeClass = "bg-gray-700 p-2 rounded block text-yellow-400 font-semibold";
  const normalClass = "hover:bg-gray-700 p-2 rounded block transition text-white";

  const navLinks = (
    <nav className="space-y-1 flex-1">
      <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? activeClass : normalClass}>Dashboard</NavLink>
      
      <div className="pt-4 pb-2 text-xs uppercase text-gray-500 font-bold tracking-wider">Inventory</div>
      <NavLink to="/admin/products" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Products</NavLink>
      <NavLink to="/admin/categories" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Categories</NavLink>
      <NavLink to="/admin/brands" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Brands</NavLink>
      <NavLink to="/admin/units" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Units</NavLink>

      <div className="pt-4 pb-2 text-xs uppercase text-gray-500 font-bold tracking-wider">Operations</div>
      <NavLink to="/admin/expenses" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Expenses</NavLink>

      <div className="pt-4 pb-2 text-xs uppercase text-gray-500 font-bold tracking-wider">Reports</div>
      <NavLink to="/admin/drawer-report" className={({ isActive }) => isActive ? activeClass : normalClass}>Drawer Report</NavLink>
      <NavLink to="/admin/shift-report" className={({ isActive }) => isActive ? activeClass : normalClass}>Shift Report</NavLink>
      <NavLink to="/admin/daily-summary-report" className={({ isActive }) => isActive ? activeClass : normalClass}>Daily Summary Report</NavLink>

      <div className="pt-4 pb-2 text-xs uppercase text-gray-500 font-bold tracking-wider">Others</div>
      <NavLink to="/admin/suppliers" className={({ isActive }) => isActive ? activeClass : normalClass}>Manage Suppliers</NavLink>
      <NavLink to="/admin/purchase" className={({ isActive }) => isActive ? activeClass : normalClass}>Purchases</NavLink>
      <NavLink to="/admin/waste" className={({ isActive }) => isActive ? activeClass : normalClass}>Waste Reports</NavLink>
    </nav>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex justify-between items-center shadow-lg z-20">
        <h2 className="font-bold text-red-500">Admin Panel</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-xl">
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white p-5 flex flex-col shadow-xl md:w-64 transition-all duration-300 ${isOpen ? 'block' : 'hidden md:flex'}`}>
        <h2 className="text-2xl font-bold mb-8 border-b border-gray-700 pb-2 text-red-500 hidden md:block">Admin Panel</h2>
        <div className="overflow-y-auto flex-1 h-[70vh] md:h-auto">
           {navLinks}
        </div>
        <div className="text-xs opacity-50 pt-4 border-t border-gray-700 mt-4">Role: System Administrator</div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminProfile;