import React, { useEffect, useState } from "react";
import reportApi from "../../api/report.service";
import { toast } from "react-hot-toast";

const ShiftReport = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShifts = async () => {
      setLoading(true);
      try {
        const res = await reportApi.getShiftReport({ page: 1, limit: 20 });
        if (res.data?.success) {
          // আপনার ডাটাবেস রেসপন্স অনুযায়ী ডাটা সেট করা
          setShifts(res.data.data.data);
        }
      } catch (err) {
        toast.error("রিপোর্ট লোড করতে ব্যর্থ হয়েছে!");
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Shift Performance History</h2>
      
      {loading ? (
        <div className="text-center py-10">Loading Data...</div>
      ) : (
        <div className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Time Period</th>
                  <th className="px-6 py-4 text-right">Sales</th>
                  <th className="px-6 py-4 text-right">Tax</th>
                  <th className="px-6 py-4 text-right">Exp.</th>
                  <th className="px-6 py-4 text-right">Deposit</th>
                  <th className="px-6 py-4 text-right">Short/Over</th>
                  <th className="px-6 py-4">Closing Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {shifts.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.status === 'closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="text-xs font-semibold">{new Date(s.startTime).toLocaleDateString()}</div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        {s.endTime ? new Date(s.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-gray-700">{s.totalSales?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{s.totalTax?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right text-red-500">{s.totalExpenses?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">{s.totalDepositedCash?.toFixed(2)}</td>
                    <td className={`px-6 py-4 text-right font-black ${s.totalShortOver < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                      {s.totalShortOver?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 italic">
                      {s.closingNote || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShiftReport;