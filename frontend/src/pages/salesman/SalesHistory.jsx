import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import saleApi from "../../api/sale.service";
import { toast } from "react-hot-toast";

const SalesHistory = () => {
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm, startDate]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      
      // ডেট ফিল্টারটি সঠিকভাবে পাঠানোর জন্য লজিক
      const params = { 
        page: currentPage, 
        limit, 
        search: searchTerm 
      };
      
      if (startDate) {
        params.startDate = startDate;
        params.endDate = startDate; // একই দিনে ফিল্টার করার জন্য
      }

      const response = await saleApi.getSales(params);
      setSales(response.data.data || []);
      setTotalSales(response.data.total || 0);
    } catch (err) {
      toast.error("Failed to load sales");
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async (e, id) => {
    e.stopPropagation();
    const reason = window.prompt("Enter reason for voiding:");
    if (!reason) return;
    try {
      await saleApi.voidSale(id, reason);
      toast.success("Transaction Voided");
      fetchSales(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Action Failed");
    }
  };

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
      >
        ← Back
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Sales History ({totalSales})</h2>

      {/* সার্চ ও ফিল্টার */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Search by ID (e.g. 90d4f)..." 
          className="p-2 border rounded-lg w-1/3 outline-none focus:ring-2 focus:ring-blue-500" 
          value={searchTerm}
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
        />
        <input 
          type="date" 
          className="p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" 
          value={startDate}
          onChange={(e) => {setStartDate(e.target.value); setCurrentPage(1);}} 
        />
      </div>

      {loading ? (
        <div className="py-20 text-center font-bold text-slate-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4">Date</th>
                <th className="p-4">ID</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr key={sale._id} className="border-b hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm">{new Date(sale.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-mono font-bold text-slate-700">#{sale._id.slice(-6).toUpperCase()}</td>
                  <td className="p-4 font-bold text-slate-800">${sale.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                      sale.status === 'voided' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {sale.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button 
                      onClick={() => navigate(`/salesman/sales/${sale._id}`)} 
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
                    >
                      Details
                    </button>
                    {sale.status !== 'voided' && (
                      <button 
                        onClick={(e) => handleVoid(e, sale._id)} 
                        className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white transition-all"
                      >
                        Void
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* প্যাগিনেশন */}
      <div className="flex justify-center mt-6 gap-4 items-center">
        <button 
          disabled={currentPage === 1} 
          onClick={() => setCurrentPage(p => p - 1)} 
          className="px-4 py-2 bg-white border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
        >Prev</button>
        <span className="text-sm font-bold text-slate-600">Page {currentPage} of {Math.ceil(totalSales / limit) || 1}</span>
        <button 
          disabled={currentPage >= Math.ceil(totalSales / limit)} 
          onClick={() => setCurrentPage(p => p + 1)} 
          className="px-4 py-2 bg-white border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50"
        >Next</button>
      </div>
    </div>
  );
};
export default SalesHistory;