import React, { useState, useEffect } from "react";
import shiftApi from "../../api/shift.service";
import saleApi from "../../api/sale.service";
import { FaHistory, FaCheckCircle, FaTimesCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ShiftSummary from "./ShiftSummary"; 

const SalesDashboard = () => {
  const [shifts, setShifts] = useState([]);
  const [currentShift, setCurrentShift] = useState(null);
  const [lastShift, setLastShift] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalShifts, setTotalShifts] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [curr, all] = await Promise.all([
          shiftApi.getCurrentShift(),
          shiftApi.getAllShifts({ page: 1, limit })
        ]);

        const activeShift = curr.data.data;
        setCurrentShift(activeShift);
        setShifts(all.data.data);
        setTotalShifts(all.data.total || 0);

        let targetId = activeShift?._id;
        if (!activeShift && all.data.data.length > 0) {
          const latest = all.data.data[0];
          setLastShift(latest);
          targetId = latest._id;
        }

        if (targetId) {
          const topRes = await saleApi.getTopItems(targetId);
          setTopItems(topRes.data.data || []);
        }
      } catch (e) {
        toast.error("Initial data sync failed");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (currentPage === 1 && !loading) return; 

    const fetchTableOnly = async () => {
      try {
        setTableLoading(true);
        const res = await shiftApi.getAllShifts({ page: currentPage, limit });
        setShifts(res.data.data);
        setTotalShifts(res.data.total || 0);
      } catch (e) {
        toast.error("Failed to load table data");
      } finally {
        setTableLoading(false);
      }
    };
    fetchTableOnly();
  }, [currentPage]);

  const getDiff = (s) => {
    if (s.status === 'open') return null;
    return Number(s.actualCashInDrawer || 0) - (Number(s.openingCash || 0) + Number(s.totalSales || 0));
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* গ্লোবাল ইনলাইন সিএসএস যা ব্রাউজার লেভেলে স্ক্রলবার হাইড করবে */}
      <style>
        {`
          .hide-bar::-webkit-scrollbar { display: none !important; }
          .hide-bar { -ms-overflow-style: none !important; scrollbar-width: none !important; }
        `}
      </style>
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto text-left pb-32">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Shift Analytics</h2>

        <div className={`p-6 rounded-2xl border-l-[12px] shadow-sm bg-white transition-all duration-500 ${currentShift ? "border-green-500" : "border-gray-300"}`}>
          <div className="flex items-center gap-4">
            {currentShift ? <FaCheckCircle className="text-4xl text-green-500" /> : <FaTimesCircle className="text-4xl text-gray-300" />}
            <div>
              <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">{currentShift ? "Shift Active" : "Shift Closed"}</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                {currentShift ? `Started: ${new Date(currentShift.openedAt).toLocaleString()}` : "Ready to start session"}
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-[200px]">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-pulse">
              <div className="h-44 bg-gray-100 rounded-2xl"></div>
              <div className="h-44 bg-gray-100 rounded-2xl"></div>
            </div>
          ) : (
            (currentShift || lastShift) && (
              <ShiftSummary shiftData={currentShift || lastShift} topItems={topItems} />
            )
          )}
        </div>

        {/* History Table Container */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-8">
          <div className="bg-gray-900 p-4 text-white font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <FaHistory className="text-blue-400" /> Transaction History
          </div>
          
          {/* এই ডিভ-এই মূলত স্ক্রলবার হাইড করা হয়েছে */}
          <div className="relative overflow-x-auto hide-bar min-h-[300px]">
            {(loading || tableLoading) && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-10 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600"></div>
              </div>
            )}
            
            <table className={`w-full table-fixed border-collapse transition-opacity duration-300 ${(loading || tableLoading) ? 'opacity-30' : 'opacity-100'}`}> 
              <thead className="bg-gray-50 text-[10px] font-black text-gray-400 border-b uppercase">
                <tr>
                  <th className="p-4 text-left w-[35%]">Session</th>
                  <th className="p-4 text-center w-[15%]">Opening</th>
                  <th className="p-4 text-center w-[15%]">Sales</th>
                  <th className="p-4 text-center w-[20%] bg-gray-50 text-gray-900 font-black">Short/Over</th>
                  <th className="p-4 text-center w-[15%]">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {shifts.map((s) => {
                  const diff = getDiff(s);
                  return (
                    <tr key={s._id} className="h-[65px] hover:bg-blue-50/20">
                      <td className="p-4 font-bold text-gray-700 text-xs truncate">
                        {new Date(s.openedAt).toLocaleDateString()} - {new Date(s.openedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="p-4 text-center text-gray-500 font-medium">${s.openingCash}</td>
                      <td className="p-4 text-center text-emerald-600 font-bold">${s.totalSales}</td>
                      <td className="p-4 text-center font-black bg-gray-50/40">
                        {diff === null ? "---" : (
                          <span className={`px-2 py-1 rounded text-[11px] ${diff === 0 ? "text-green-600" : diff < 0 ? "text-red-600" : "text-blue-600"}`}>
                            {diff.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black ${s.status === 'open' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 shadow-[0_-10px_25px_rgba(0,0,0,0.05)] z-[100] overflow-x-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Showing Page <span className="text-blue-600 text-sm">{currentPage}</span> of {Math.ceil(totalShifts / limit) || 1}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              disabled={currentPage === 1 || loading || tableLoading} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 font-bold text-xs uppercase hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              <FaChevronLeft size={10} /> Prev
            </button>
            
            <button 
              disabled={currentPage >= Math.ceil(totalShifts / limit) || loading || tableLoading} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 font-bold text-xs uppercase hover:bg-black hover:text-white transition-all disabled:opacity-20"
            >
              Next <FaChevronRight size={10} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;