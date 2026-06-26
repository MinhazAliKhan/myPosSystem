import React, { useState } from "react";
import DailySummary from "../common/AdminDashboardSummary"; 
import DrawerReport from "../../features/report/DrawerReport"; 
import ShiftReport from "../../features/report/ShiftReport"; // নতুন ইমপোর্ট

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("drawers");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-black mb-6">Admin Overview</h1>
      
      {/* ট্যাব বাটন */}
      <div className="flex gap-4 mb-6">
        
        <button 
          onClick={() => setActiveTab("drawers")} 
          className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "drawers" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
        >
          Drawer Reports
        </button>
        <button 
          onClick={() => setActiveTab("shifts")} 
          className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "shifts" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
        >
          Shift Reports
        </button>
        <button 
          onClick={() => setActiveTab("summary")} 
          className={`px-4 py-2 text-sm font-bold rounded-lg transition ${activeTab === "summary" ? "bg-blue-600 text-white" : "bg-white text-gray-600"}`}
        >
          Running Shift Summary
        </button>
      </div>

      {/* কন্ডিশনাল রেন্ডারিং */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {activeTab === "summary" && <DailySummary />}
        {activeTab === "drawers" && <DrawerReport />}
        {activeTab === "shifts" && <ShiftReport />}
      </div>
    </div>
  );
};

export default AdminDashboard;