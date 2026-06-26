import React, { useEffect, useState } from "react";
import reportApi from "../../api/report.service";
import { toast } from "react-hot-toast";

const DrawerReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await reportApi.getDrawerReport({ page: 1, limit: 20 });
        
        // এখানে ডাটা স্ট্রাকচারটি সঠিকভাবে ধরুন:
        // আপনার রেসপন্স অনুযায়ী: res.data (হলো মূল অবজেক্ট) -> .data (হলো {data: [...], total: 44}) -> .data (হলো আসল লিস্ট)
        if (res.data?.success && res.data.data?.data) {
          setReports(res.data.data.data); 
        }
      } catch (err) {
        toast.error("রিপোর্ট লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-black mb-6 uppercase text-gray-800 tracking-wider">Drawer Reports</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-[11px] uppercase border-b border-gray-50">
              <th className="pb-4 px-2">Date</th>
              <th className="pb-4 px-2">Salesman</th>
              <th className="pb-4 px-2">Time (Start/End)</th>
              <th className="pb-4 px-2">Status</th>
              <th className="pb-4 px-2 text-right">Opening</th>
              <th className="pb-4 px-2 text-right">TotalSales</th>
              <th className="pb-4 px-2 text-right">Expenses</th>
              <th className="pb-4 px-2 text-right">Deposited</th>
              <th className="pb-4 px-2 text-right">Short/Over</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan="9" className="py-10 text-center text-gray-400">Loading reports...</td>
              </tr>
            ) : reports.length > 0 ? (
              reports.map((item) => (
                <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                  <td className="py-4 px-2 text-gray-600">
                    {new Date(item.startTime).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2 font-bold text-gray-700">
                    {item.user?.userName || "N/A"}
                  </td>
                  <td className="py-4 px-2 text-xs text-gray-500">
                    <div>{new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-gray-400">
                      {item.endTime ? new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] uppercase font-bold">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">{item.openingCash?.toFixed(2)}</td>
                  <td className="py-4 px-2 text-right">{item.drawerSales?.toFixed(2)}</td>
                  <td className="py-4 px-2 text-right font-bold text-gray-500">
                    {item.drawerExpenses?.toFixed(2) || "0.00"}
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-indigo-600">
                    {item.actualCashEntered?.toFixed(2) || "0.00"}
                  </td>
                  <td className={`py-4 px-2 text-right font-black ${item.shortOver < 0 ? "text-red-500" : "text-emerald-600"}`}>
                    {item.shortOver?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-10 text-center text-gray-500">No drawer records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DrawerReport;