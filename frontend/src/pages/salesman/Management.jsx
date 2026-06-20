import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import shiftApi from "../../api/shift.service";
import reportApi from "../../api/report.service";
import { toast } from "react-hot-toast";

const Management = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeShift, setActiveShift] = useState(null);
  const [activeDrawer, setActiveDrawer] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const res = await shiftApi.getCurrentStatus();
        if (res.data?.success) {
          const { shift, drawers } = res.data.data;
          setActiveShift(shift);
          setActiveDrawer(drawers.length > 0 ? drawers[0] : null);
        }
      } catch (err) {
        toast.error("Status fetch failed");
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const Btn = ({ label, onClick, path, color, disabled }) => (
    <button
      onClick={onClick ? onClick : () => navigate(path)}
      disabled={disabled || loading}
      className={`group relative w-full p-4 md:p-6 rounded-3xl font-bold text-[11px] md:text-[13px] uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center 
      ${disabled 
        ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
        : color === "red" 
          ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white shadow-sm hover:shadow-red-200 hover:shadow-lg" 
          : color === "emerald" 
            ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white shadow-sm hover:shadow-emerald-200 hover:shadow-lg" 
            : "bg-white text-gray-700 hover:bg-gray-800 hover:text-white shadow-sm hover:shadow-gray-200 hover:shadow-lg"
      }`}
    >
      {loading ? "Loading..." : label}
      {!disabled && (
        <span className="absolute bottom-3 md:bottom-4 opacity-0 group-hover:opacity-100 transition-opacity text-[9px]">●●●</span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-8 md:mb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">MANAGEMENT</h1>
        <p className="text-gray-400 text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase mt-2">Station Control Center</p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <Btn label="Open Shift" path="/salesman/open-shift" color="red" disabled={!!activeShift} />
        <Btn label="Close Shift" path="/salesman/close-shift" color="red" disabled={!activeShift} />
        <Btn label="Open Drawer" path="/salesman/open-drawer" color="emerald" disabled={!activeShift || !!activeDrawer} />
        
        <Btn 
          label="Close Drawer" 
          color="emerald"
          disabled={!activeDrawer}
          onClick={() => activeDrawer && navigate(`/salesman/drawer/${activeDrawer._id}/close`)} 
        />
        
        <Btn label="Drawer Report" path="/salesman/drawer-report" />
        <Btn label="Dashboard" path="/salesman/dashboard" />
        <Btn label="Inventory" path="/salesman/inventory" />
        <Btn label="Sales History" path="/salesman/my-sales" />
        <Btn label="Refunds" path="/salesman/refunds" />
        
        {/* POS Terminal এখন সবসময় অ্যাক্টিভ */}
        <Btn label="POS Terminal" path="/salesman" color="red" />
      </div>
    </div>
  );
};

export default Management;