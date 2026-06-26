import React, { useEffect, useState } from "react";
import reportApi from "../../api/report.service"; 

const DailySummary = () => {
  const [summary, setSummary] = useState({ totalSales: 0, totalDepositedCash: 0, netRevenue: 0, totalExpenses: 0 });
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // query object হিসেবে date পাঠানো হচ্ছে
        const response = await reportApi.getDailySummaryReport({ date });
        
        // সার্ভার থেকে আসা শিফটের লিস্ট (Array)
        const shifts = response?.data?.data || []; 

        if (shifts.length > 0) {
          const calculated = shifts.reduce((acc, shift) => {
            acc.totalSales += (shift.totalSales || 0);
            acc.totalDepositedCash += (shift.totalDepositedCash || 0);
            acc.totalExpenses += (shift.totalExpenses || 0); // Expenses যোগ করা হলো
            // নেট রেভিনিউ = টোটাল সেলস - টোটাল এক্সপেন্স
            acc.netRevenue += (shift.totalSales - (shift.totalExpenses || 0));
            return acc;
          }, { totalSales: 0, totalDepositedCash: 0, netRevenue: 0, totalExpenses: 0 });

          setSummary(calculated);
        } else {
          setSummary({ totalSales: 0, totalDepositedCash: 0, netRevenue: 0, totalExpenses: 0 });
        }
      } catch (err) {
        console.error("Error fetching summary:", err);
      }
    };
    fetchSummary();
  }, [date]);

  return (
    <div className="space-y-6 p-6">
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        className="p-2 border rounded-lg" 
      />
      
      <div className="grid grid-cols-4 gap-4"> {/* কলাম ৪টি করা হয়েছে */}
        <StatCard title="Total Sales" value={summary.totalSales} color="text-blue-600" />
        <StatCard title="Total Expenses" value={summary.totalExpenses} color="text-red-600" /> {/* নতুন কার্ড */}
        <StatCard title="Deposited" value={summary.totalDepositedCash} color="text-indigo-600" />
        <StatCard title="Net Revenue" value={summary.netRevenue} color="text-emerald-600" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border">
    <p className="text-[10px] font-bold text-gray-400 uppercase">{title}</p>
    <h3 className={`text-xl font-black ${color}`}>
      {typeof value === 'number' ? value.toFixed(2) : "0.00"}
    </h3>
  </div>
);

export default DailySummary;