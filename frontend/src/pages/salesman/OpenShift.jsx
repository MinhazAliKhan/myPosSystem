import React, { useState, useEffect } from "react";
import shiftApi from "../../api/shift.service"; 
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaUnlockAlt, FaCheckCircle, FaInfoCircle } from "react-icons/fa";

const OpenShift = () => {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    shiftApi.getCurrentShift()
      .then(res => {
        if (res.data.data) setIsActive(true);
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpen = async () => {
    try {
      await shiftApi.openShift();
      toast.success("Shift started with $200!");
      navigate("/salesman/new-order");
    } catch (error) {
      toast.error(error.response?.data?.message || "Already have an open shift!");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-green-500"></div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-green-50 flex items-center justify-center rounded-full text-green-600 mb-4 shadow-inner">
            <FaUnlockAlt size={28} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Open New Shift</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Ready to start selling?</p>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaInfoCircle className="text-blue-500" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Initial Setup</span>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-xs font-bold">Opening Balance</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none">$200.00</h3>
            </div>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              Pre-set
            </div>
          </div>
          <p className="text-[9px] text-gray-400 mt-4 leading-relaxed uppercase font-semibold">
            * This float amount is required for initial change management in the cash drawer.
          </p>
        </div>

        {isActive ? (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
            <div className="text-amber-600 mt-0.5">⚠️</div>
            <p className="text-xs font-bold text-amber-700 uppercase tracking-tight leading-relaxed">
              A shift is already active. Please finalize and close it before starting a new session.
            </p>
          </div>
        ) : (
          <button
            onClick={handleOpen}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <FaCheckCircle />
            Confirm & Start Shift
          </button>
        )}
      </div>
    </div>
  );
};

export default OpenShift;