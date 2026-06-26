import React, { useState, useEffect } from "react";
import reportApi from "../../api/reportApi";
import { toast } from "react-hot-toast";

const AdminDashboardSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // নতুন এরর স্টেট

  useEffect(() => {
    fetchAdminSummary();
  }, []);

  const fetchAdminSummary = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await reportApi.getAdminSummary();
      setSummary(response.data.data);
    } catch (err) {
      // যদি শিফট না থাকে বা অন্য এরর হয়, তবে সেটি চেক করো
      const message = err.response?.data?.message || "Error loading admin data";
      setError(message);
      
      // শুধুমাত্র শিফট সংক্রান্ত এরর ছাড়া অন্য সব ক্ষেত্রে টোস্ট দেখাও
      if (message !== "No active shift found.") {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  // ১. লোডিং স্টেট
  if (loading) return <div className="p-10 text-center text-sm text-gray-400">Loading admin dashboard...</div>;

  // ২. শিফট না থাকলে সুন্দর মেসেজ (টোস্টের বদলে)
  if (error) {
    return (
      <div className="p-10 text-center flex flex-col items-center">
        <h3 className="text-gray-500 font-bold tracking-widest uppercase">{error}</h3>
        <p className="text-xs text-gray-400 mt-2">Please start a shift to view the dashboard.</p>
        <button onClick={fetchAdminSummary} className="mt-4 text-xs bg-gray-200 px-4 py-2 rounded">Retry</button>
      </div>
    );
  }

  const StatItem = ({ label, value, colorClass, borderClass }) => (
    <div className={`bg-white p-4 rounded-lg border-l-4 ${borderClass} shadow-sm flex flex-col justify-between`}>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
      <span className={`text-xl font-black mt-1 ${colorClass}`}>$ {value}</span>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-400 text-xs">Full store performance overview</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatItem label="Total Store Sales" value={summary?.sales?.totalSales?.toFixed(2) || "0.00"} colorClass="text-blue-600" borderClass="border-blue-500" />
        <StatItem label="Total Store Expenses" value={summary?.expenses?.totalExpenses?.toFixed(2) || "0.00"} colorClass="text-red-500" borderClass="border-red-500" />
        <StatItem label="Net Store Cash" value={( (summary?.sales?.totalSales || 0) - (summary?.expenses?.totalExpenses || 0) ).toFixed(2)} colorClass="text-emerald-600" borderClass="border-emerald-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* টপ প্রোডাক্ট */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Top Products (Store-wide)</h3>
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
            <span className="text-xl font-black text-purple-600">${summary?.profit?.netProfit?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase">Avg Basket Value</h3>
            <span className="text-xl font-black text-teal-600">${summary?.avgBasket?.averageValue?.toFixed(2) || "0.00"}</span>
          </div>
        </div>

        {/* ভয়েড সামারি */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Voided Reasons</h3>
          {summary?.voidedSummary?.length > 0 ? summary.voidedSummary.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm mb-1 text-orange-600">
              <span className="font-medium">{item._id}</span>
              <span>{item.count} items / ${item.totalVoidedAmount.toFixed(2)}</span>
            </div>
          )) : <p className="text-sm text-gray-400">No voided transactions</p>}
        </div>

        {/* সেলসম্যান পারফরম্যান্স */}
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Salesman Performance</h3>
          {summary?.salesmanPerformance?.length > 0 ? (
            <div className="space-y-2">
              {summary.salesmanPerformance.map((s, idx) => (
                <div key={idx} className="flex justify-between text-sm border-b pb-1 last:border-0">
                  <span className="text-gray-700 font-medium">{s.name}</span>
                  <span className="text-gray-900 font-bold">${s.totalSales.toFixed(2)}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No performance data</p>}
        </div>

        {/* আওয়ারলি সেলস */}
        <div className="bg-white p-4 rounded-lg shadow-sm border md:col-span-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Hourly Sales</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {summary?.hourlySales?.length > 0 ? (
              summary.hourlySales.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[60px]">
                  <span className="text-xs font-bold text-gray-600">{item._id}:00</span>
                  <span className="text-sm font-bold text-blue-600">${(item.totalAmount || 0).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400">No hourly data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardSummary;