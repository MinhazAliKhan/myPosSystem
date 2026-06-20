import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import reportApi from "../../../api/report.service";
import { toast } from "react-hot-toast";

const DrawerReport = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const limit = 5;

  const fetchDrawerReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportApi.getDrawerReport({ 
        page, 
        limit, 
        startDate, 
        endDate 
      });
      
      if (res.data?.success) {
        setReports(res.data.data.data);
        setTotal(res.data.data.total);
      }
    } catch (err) {
      setError("Failed to load reports");
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrawerReports();
  }, [page, startDate, endDate]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Drawer Reports</h1>
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{total} Total Records</span>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input type="date" className="p-2 border rounded-lg text-sm" onChange={(e) => setStartDate(e.target.value)} />
          <input type="date" className="p-2 border rounded-lg text-sm" onChange={(e) => setEndDate(e.target.value)} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-[11px] uppercase tracking-[0.2em] border-b border-gray-100">
                <th className="pb-5 px-2">Date</th>
                <th className="pb-5 px-2">User Info</th>
                <th className="pb-5 px-2">Status</th>
                <th className="pb-5 px-2 text-right">Opening</th>
                <th className="pb-5 px-2 text-right">Sales</th>
                <th className="pb-5 px-2 text-right">Actual</th>
                <th className="pb-5 px-2 text-right">Short/Over</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="7" className="py-12 text-center text-gray-400 italic">Loading...</td></tr>
              ) : error ? (
                <tr><td colSpan="7" className="py-12 text-center text-red-400">{error}</td></tr>
              ) : reports.length > 0 ? (
                reports.map((item) => (
                  <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-5 px-2 text-gray-700">{new Date(item.startTime).toLocaleDateString()}</td>
                    <td className="py-5 px-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-800">{item.user?.userName || "N/A"}</span>
                        <span className="text-[10px] text-gray-400 uppercase">{item.user?.role || "N/A"}</span>
                      </div>
                    </td>
                    <td className="py-5 px-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${item.status === 'active' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-2 text-right font-semibold">{item.openingCash?.toFixed(2)}</td>
                    <td className="py-5 px-2 text-right">{item.drawerSales?.toFixed(2)}</td>
                    <td className="py-5 px-2 text-right font-bold text-indigo-600">{item.actualCashEntered?.toFixed(2) || "0.00"}</td>
                    <td className={`py-5 px-2 text-right font-black ${item.shortOver < 0 ? "text-red-500" : "text-emerald-600"}`}>
                      {item.shortOver?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="py-12 text-center text-gray-400">No records found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i + 1)}
                className={`px-4 py-2 rounded-lg text-xs font-bold ${page === i + 1 ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DrawerReport;