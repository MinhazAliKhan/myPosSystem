import React, { useEffect, useState } from "react";
import reportApi from "../../api/report.service";

const ShiftReport = () => {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await reportApi.getShiftReport({ page: 1, limit: 10 });
        // ব্যাকএন্ডের এগ্রিগেশন অনুযায়ী সরাসরি ডেটা সেট করা
        setReport(res.data?.data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h1 className="text-xl font-black mb-6 uppercase text-gray-800">Shift Performance Report</h1>

      {report.map((group) => (
        <div key={group._id} className="mb-8 border rounded-xl overflow-hidden shadow-sm">
          {/* হেডার: তারিখ এবং দিনের মোট সারসংক্ষেপ */}
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{group._id}</h2>
            <div className="text-[10px] font-bold text-gray-500 uppercase">
              Sales: {group.dailySales.toFixed(2)} | Deposit: {group.dailyDeposit.toFixed(2)}
            </div>
          </div>

          <table className="w-full text-left text-sm">
            <thead className="bg-white">
              <tr className="text-gray-400 text-[10px] uppercase border-b">
                <th className="py-2 px-4">Time</th>
                <th className="py-2 px-4 text-right">Sales</th>
                <th className="py-2 px-4 text-right">Deposit</th>
                <th className="py-2 px-4 text-right">Diff</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {group.shifts.map((s) => (
                <tr key={s._id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4 text-right font-medium">{s.totalSales.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-bold text-indigo-600">{s.totalDepositedCash.toFixed(2)}</td>
                  <td className={`py-3 px-4 text-right font-mono ${s.shortOver < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {s.shortOver.toFixed(2)}
                  </td>
                </tr>
              ))}
              {/* ডেইলি টোটাল ফুটার */}
              <tr className="bg-indigo-50/50 font-bold text-xs text-indigo-700">
                <td className="py-3 px-4 uppercase">Daily Total</td>
                <td className="py-3 px-4 text-right">{group.dailySales.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">{group.dailyDeposit.toFixed(2)}</td>
                <td className="py-3 px-4 text-right">{group.dailyShortOver.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ShiftReport;