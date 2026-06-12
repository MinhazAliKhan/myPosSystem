import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shiftApi from "../../../api/shift.service";
import { toast } from "react-hot-toast";

const CloseShift = () => {
  const navigate = useNavigate();
  const [closingNote, setClosingNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      
      // ১. ভুল আইডি পাঠানোর পরিবর্তে আমাদের নতুন এন্ডপয়েন্ট ব্যবহার করুন
      const res = await shiftApi.getCurrentStatus(); 
      const activeShiftId = res.data?.data?.shift?._id;

      if (!activeShiftId) {
        toast.error("No active shift found!");
        setLoading(false);
        return;
      }

      const payload = { 
        closingNote: closingNote.trim() 
      };

      // ২. এবার সঠিক আইডি যাচ্ছে
      await shiftApi.closeShift(activeShiftId, payload);

      toast.success("Master Shift Closed successfully!");
      navigate("/salesman/manage");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to finalize master shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-md">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Close Master Shift
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Terminate Station Session
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Manager Closing Note / Report
            </label>
            <textarea
              placeholder="Enter any shift discrepancies..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-red-500 transition-all font-medium text-sm h-28 resize-none"
              value={closingNote}
              onChange={(e) => setClosingNote(e.target.value)}
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate("/salesman/manage")}
              className="w-1/3 py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-4 bg-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 border-2 border-red-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Locking..." : "Terminate Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CloseShift;