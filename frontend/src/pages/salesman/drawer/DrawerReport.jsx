import React, { useEffect, useState } from "react";
import reportApi from "../../../api/report.service";
import { toast } from "react-hot-toast";

const DrawerReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDrawerReports = async () => {
    try {
      setLoading(true);
      const res = await reportApi.getDrawerReport({ page: 1, limit: 10 });
      if (res.data?.data?.data) {
        setReports(res.data.data.data);
      }
    } catch (err) {
      toast.error("রিপোর্ট লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawerReports();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest">
            Drawer Reports
          </h1>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {reports.length} Total Records
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="pb-5 px-2">Date</th>
                <th className="pb-5 px-2">Status</th>
                <th className="pb-5 px-2 text-right">Opening</th>
                <th className="pb-5 px-2 text-right">Sales</th>
                <th className="pb-5 px-2 text-right">Actual</th>
                <th className="pb-5 px-2 text-right">Short/Over</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="py-12 text-center text-gray-400 italic">Loading reports...</td></tr>
              ) : reports.length > 0 ? (
                reports.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-5 px-2 text-gray-700 font-medium">
                      {item.startTime ? new Date(item.startTime).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="py-5 px-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider
                        ${item.status === 'active' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-2 text-right font-semibold text-gray-700">
                      {item.openingCash?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-5 px-2 text-right text-gray-600">
                      {item.drawerSales?.toFixed(2) || "0.00"}
                    </td>
                    <td className="py-5 px-2 text-right font-bold text-indigo-600">
                      {item.actualCashEntered !== undefined ? item.actualCashEntered.toFixed(2) : "-"}
                    </td>
                    <td className={`py-5 px-2 text-right font-black tracking-tight
                      ${item.shortOver !== undefined ? (item.shortOver < 0 ? "text-red-500" : "text-emerald-600") : "text-gray-300"}`}>
                      {item.shortOver !== undefined ? (item.shortOver > 0 ? "+" : "") + item.shortOver.toFixed(2) : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="6" className="py-12 text-center text-gray-400">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DrawerReport;