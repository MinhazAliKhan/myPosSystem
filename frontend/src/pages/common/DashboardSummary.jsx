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
      const message = err.response?.data?.message || "Error loading data";
      setError(message);
      if (err.response?.status !== 400) toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-sm text-gray-400">Loading dashboard...</div>;

  // Custom Card Component
  const StatItem = ({ label, value, colorClass, borderClass }) => (
    <div className={`bg-white p-4 rounded-lg border-l-4 ${borderClass} shadow-sm flex flex-col justify-between`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-black mt-1 ${colorClass}`}>
        $ {value}
      </span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-400 text-xs">Overview for {user?.name}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatItem 
          label="Total Sales" 
          value={summary?.sales?.totalSales?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"} 
          colorClass="text-blue-600"
          borderClass="border-blue-500"
        />
        <StatItem 
          label="Total Expenses" 
          value={summary?.expenses?.totalExpenses?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"} 
          colorClass="text-red-500"
          borderClass="border-red-500"
        />
        <StatItem 
          label="Net Cash" 
          value={summary?.netCash?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"} 
          colorClass="text-emerald-600"
          borderClass="border-emerald-500"
        />
      </div>
    </div>
  );
};

export default DashboardSummary;