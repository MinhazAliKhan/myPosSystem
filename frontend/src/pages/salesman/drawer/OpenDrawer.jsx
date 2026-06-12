import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import shiftApi from "../../../api/shift.service";
import { toast } from "react-hot-toast";

const OpenDrawer = () => {
  const navigate = useNavigate();
  const [openingCash, setOpeningCash] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const payload = {
        openingCash: openingCash === "" ? 0 : Number(openingCash)
      };

      await shiftApi.openDrawer(payload);
      
      toast.success("Cash Drawer Session Started successfully!");
      navigate("/salesman/manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initialize drawer session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-md">
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Open Cash Drawer
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Initialize Register Cash Float
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Opening Cash Amount *
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-base text-gray-800"
              value={openingCash}
              onChange={(e) => setOpeningCash(e.target.value)}
              required
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
              className="w-2/3 py-4 bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all active:scale-95 border-2 border-emerald-300 hover:shadow-lg disabled:opacity-50"
            >
              {loading ? "Starting..." : "Open Drawer"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OpenDrawer;