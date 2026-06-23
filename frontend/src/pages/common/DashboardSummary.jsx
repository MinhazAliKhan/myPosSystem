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

  const StatItem = ({ label, value, colorClass, borderClass }) => (
    <div className={`bg-white p-4 rounded-lg border-l-4 ${borderClass} shadow-sm flex flex-col justify-between`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-black mt-1 ${colorClass}`}>$ {value}</span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-400 text-xs">Overview for {user?.name}</p>
      </div>
      
      {/* মেইন স্ট্যাটাস কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatItem label="Total Sales" value={summary?.sales?.totalSales?.toFixed(2) || "0.00"} colorClass="text-blue-600" borderClass="border-blue-500" />
        <StatItem label="Total Expenses" value={summary?.expenses?.totalExpenses?.toFixed(2) || "0.00"} colorClass="text-red-500" borderClass="border-red-500" />
        <StatItem label="Net Cash" value={summary?.netCash?.toFixed(2) || "0.00"} colorClass="text-emerald-600" borderClass="border-emerald-500" />
      </div>

      {/* সেকেন্ডারি ডাটা গ্রিড */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* টপ প্রোডাক্ট */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Top Products</h3>
          <div className="space-y-2">
            {summary?.topProducts?.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm border-b pb-1 last:border-0">
                <span className="text-gray-700">{item.name} <span className="text-[10px] text-gray-400">(x{item.totalQuantity})</span></span>
                <span className="font-bold text-gray-900">${item.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* প্রফিট ও বাস্কেট */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Net Profit</h3>
            <span className="text-xl font-black text-purple-600">${summary?.profitSummary?.netProfit?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Avg Basket Value</h3>
            <span className="text-xl font-black text-teal-600">${summary?.averageBasket?.averageValue?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        {/* ভয়েড সামারি */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Voided Reasons</h3>
          {summary?.voidedSummary?.length > 0 ? summary.voidedSummary.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm mb-1 text-orange-600">
              <span className="font-medium">{item._id}</span>
              <span>{item.count} items / ${item.totalVoidedAmount.toFixed(2)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">No voided transactions</p>}
        </div>

        {/* আওয়ারলি সেলস */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Hourly Sales</h3>
          <div className="flex gap-4 overflow-x-auto">
            {summary?.hourlySales?.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center min-w-[60px]">
                <span className="text-xs font-bold text-gray-600">{item._id}:00</span>
                <span className="text-sm font-bold text-blue-600">${item.totalAmount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;