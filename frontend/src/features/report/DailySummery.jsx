import React, { useEffect, useState } from "react";
import reportApi from "../../api/report.service";

const DailySummary = () => {
  const [summary, setSummary] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await reportApi.getDailySummaryReport({ date });
        
        // আপনার সার্ভার রেসপন্স অনুযায়ী: { success: true, data: { ... } }
        // axios response.data হলো আপনার সার্ভারের মূল অবজেক্ট (success + data)
        // তাই আমাদের summary তে সেট করতে হবে response.data.data
        if (response && response.data && response.data.data) {
          console.log("Setting Summary:", response.data.data);
          setSummary(response.data.data);
        } else if (response && response.data) {
          // যদি রেসপন্স স্ট্রাকচার ভিন্ন হয়
          setSummary(response.data);
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
      
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Sales" value={summary?.totalSales} color="text-blue-600" />
        <StatCard title="Deposited" value={summary?.totalDepositedCash} color="text-indigo-600" />
        <StatCard title="Net Revenue" value={summary?.netRevenue} color="text-emerald-600" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }) => {
  const safeValue = typeof value === "number" ? value : 0;
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <p className="text-[10px] font-bold text-gray-400 uppercase">{title}</p>
      <h3 className={`text-xl font-black ${color}`}>
        {safeValue.toFixed(2)}
      </h3>
    </div>
  );
};

export default DailySummary;