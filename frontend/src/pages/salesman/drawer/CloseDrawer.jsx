import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import shiftApi from "../../../api/shift.service";
import { toast } from "react-hot-toast";

const CloseDrawer = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ইউআরএল রাউট থেকে সরাসরি ড্রয়ার আইডি (/:id) রিড করা হচ্ছে
  const [actualCash, setActualCash] = useState("");
  const [bagNumber, setBagNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ইউআরএল এ আইডি না থাকলে ব্যাকএন্ডে রিকোয়েস্ট পাঠানোর দরকার নেই
    if (!id) {
      toast.error("Invalid Request: Drawer Session ID is missing from URL.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        actualCashEntered: Number(actualCash),
        bagNumber: bagNumber.trim()
      };

      // আপনার রাউট অনুযায়ী ডাইনামিক আইডি এবং পেলোড পাস হচ্ছে
      await shiftApi.closeDrawer(id, payload);
      
      toast.success("Drawer Session Cashed Out & Finalized!");
      navigate("/salesman/manage");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to close drawer register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border-2 border-gray-200 shadow-md">
        
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight text-gray-900">
            Close Cash Drawer
          </h2>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Safe Drop & Register Audit
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Actual Hand-Counted Cash *
            </label>
            <input
              type="number"
              placeholder="0.00"
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all font-bold text-base text-gray-800"
              value={actualCash}
              onChange={(e) => setActualCash(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
              Security Bag Drop Number *
            </label>
            <input
              type="text"
              placeholder="e.g. BAG-8892"
              className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 transition-all font-medium text-sm"
              value={bagNumber}
              onChange={(e) => setBagNumber(e.target.value)}
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
              {loading ? "Cashing Out..." : "Submit Safe Drop"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CloseDrawer;