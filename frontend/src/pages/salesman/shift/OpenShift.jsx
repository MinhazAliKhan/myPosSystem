import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shiftApi from "../../../api/shift.service";
import { toast } from "react-hot-toast";

const OpenShift = () => {
  const navigate = useNavigate();
  const [openingNote, setOpeningNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = { 
        openingNote: openingNote.trim() || `Shift Started at ${new Date().toLocaleTimeString()}`
      };
      
      await shiftApi.openShift(payload);
      
      toast.success("Master Shift Station Opened Successfully!");
      navigate("/salesman/manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to open master shift");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-md">
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Open Master Shift
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Establish Station Terminal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Opening Shift Note / Summary
            </label>
            <textarea
              placeholder="e.g. Morning Crew Counter A initialization notes..."
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-red-500 transition-all font-medium text-sm h-28 resize-none"
              value={openingNote}
              onChange={(e) => setOpeningNote(e.target.value)}
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
              {loading ? "Opening..." : "Establish Shift"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OpenShift;