import React, { useState, useEffect } from "react";
import shiftApi from "../../api/shift.service"; 
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaLock, FaExclamationTriangle, FaCashRegister } from "react-icons/fa";

const CloseShift = () => {
  const [data, setData] = useState({ 
    actualCashInDrawer: "", 
    bagNumber: "" 
  });
  const [hasActiveShift, setHasActiveShift] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await shiftApi.getCurrentShift();
        if (!response.data.data) {
          setHasActiveShift(false);
          toast.error("No active shift found to close!");
        }
      } catch (error) {
        console.error("Status check failed", error);
      } finally {
        setLoading(false);
      }
    };
    checkStatus();
  }, []);

  const handleClose = async (e) => {
    e.preventDefault();
    if (!data.actualCashInDrawer || !data.bagNumber) {
      return toast.error("Please fill in all fields");
    }

    try {
      await shiftApi.closeShift({
        actualCashInDrawer: Number(data.actualCashInDrawer),
        bagNumber: data.bagNumber
      });
      toast.success("Shift Closed Successfully!");
      navigate("/salesman/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error closing shift!");
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
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-red-50 flex items-center justify-center rounded-full text-red-600 mb-4 shadow-inner">
            <FaLock size={24} />
          </div>
          <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">End My Shift</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Finalize your session</p>
        </div>

        {!hasActiveShift && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700 text-[11px] font-black uppercase tracking-tight">
            <FaExclamationTriangle className="text-lg shrink-0" />
            <p>No active shift found. Please start a shift first.</p>
          </div>
        )}

        <form onSubmit={handleClose} className="space-y-5">
          <div className="relative">
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">
              Actual Cash in Drawer ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input
                type="number"
                required
                disabled={!hasActiveShift}
                className={`w-full border-2 pl-8 pr-4 py-3.5 rounded-xl outline-none font-black text-lg transition-all ${
                  !hasActiveShift ? "bg-gray-50 border-gray-100 text-gray-300" : "border-gray-50 bg-gray-50 focus:bg-white focus:border-red-600 text-gray-800"
                }`}
                placeholder="0.00"
                value={data.actualCashInDrawer}
                onChange={(e) => setData({ ...data, actualCashInDrawer: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">
              Cash Bag Number
            </label>
            <input
              type="text"
              required
              disabled={!hasActiveShift}
              className={`w-full border-2 px-4 py-3.5 rounded-xl outline-none font-bold transition-all ${
                !hasActiveShift ? "bg-gray-50 border-gray-100 text-gray-300" : "border-gray-50 bg-gray-50 focus:bg-white focus:border-red-600 text-gray-800"
              }`}
              placeholder="e.g. BAG-102"
              value={data.bagNumber}
              onChange={(e) => setData({ ...data, bagNumber: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={!hasActiveShift}
            className={`w-full py-4 mt-4 rounded-xl font-black text-xs shadow-lg transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 ${
              !hasActiveShift 
                ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                : "bg-gray-900 hover:bg-black text-white active:scale-95 shadow-gray-200"
            }`}
          >
            <FaCashRegister />
            {hasActiveShift ? "Close & Finalize" : "Locked"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CloseShift;