import React, { useState, useEffect } from "react";
import reportApi from "../../api/reportApi";
import { useAuth } from "../../store/AuthContext";
import { toast } from "react-hot-toast";

const DashboardSummary = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await reportApi.getSalesmanSummary();
      setSummary(response.data.data);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to load report data!";
      setError(message);
      
      if (err.response?.status !== 400) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-6 text-center">
        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 max-w-sm">
          <h3 className="text-lg font-bold text-amber-800 mb-2">Attention Required</h3>
          <p className="text-amber-600 mb-6">{error}</p>
          <button 
            onClick={fetchSummary}
            className="px-6 py-2 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900">Dashboard</h2>
        <p className="text-gray-400 text-xs tracking-[0.2em] uppercase">Welcome back, {user?.name}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Sales */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Total Sales</h3>
          <p className="text-3xl font-black text-blue-600">
            $ {summary?.sales?.totalSales?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
          </p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Total Expenses</h3>
          <p className="text-3xl font-black text-red-500">
            $ {summary?.expenses?.totalExpenses?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
          </p>
        </div>

        {/* Net Cash */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Net Cash</h3>
          <p className="text-3xl font-black text-emerald-600">
            $ {summary?.netCash?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;