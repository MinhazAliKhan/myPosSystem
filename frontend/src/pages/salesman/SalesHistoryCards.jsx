import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import saleApi from "../../api/sale.service";
import { toast } from "react-hot-toast";

const SalesHistoryCards = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const limit = 9; 

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm, startDate]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = { page: currentPage, limit, search: searchTerm };
      if (startDate) {
        params.startDate = startDate;
        params.endDate = startDate; 
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

  const handleDetails = (id) => {
    if (pathname.includes("/admin")) {
      navigate(`/admin/sales/${id}`);
    } else {
      navigate(`/salesman/sales/${id}`);
    }
  };

  // UI থেকে শুধু সরানোর জন্য আলাদা ফাংশন
  const handleRemoveFromUI = (e, id) => {
    e.stopPropagation();
    setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
    toast.success("Removed from view");
  };

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
      >
        ← Back
      </button>
      
      <h2 className="text-2xl font-bold mb-6 text-slate-800">Sales History ({sales.length})</h2>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex gap-4">
        <input 
          type="text" 
          placeholder="Search by ID..." 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sales.map((sale) => (
            <div key={sale._id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Sale ID</p>
                  <p className="font-mono font-bold text-slate-700">#{sale._id.slice(-6).toUpperCase()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                  sale.status === 'voided' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {sale.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-1 mb-2 text-sm">
                <p className="text-slate-500">Date: <span className="font-semibold text-slate-800">{new Date(sale.createdAt).toLocaleDateString()}</span></p>
                <p className="text-slate-500">Cashier: <span className="font-semibold text-slate-800">{sale.createdBy?.userName || "N/A"}</span></p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-2 tracking-wider">Items Purchased</p>
                <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto">
                  {sale.items && sale.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-800 truncate pr-4">{item.name}</span>
                      <span className="text-xs font-black text-blue-700 bg-blue-100 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                <span className="text-base font-black text-slate-800">${sale.totalAmount.toFixed(2)}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleDetails(sale._id)} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white">View</button>
                  {/* এটি শুধু UI থেকে রিমুভ করবে */}
                  <button onClick={(e) => handleRemoveFromUI(e, sale._id)} className="bg-orange-50 text-orange-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-orange-600 hover:text-white">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8 gap-4 items-center">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 bg-white border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50">Prev</button>
        <span className="text-sm font-bold text-slate-600">Page {currentPage} of {Math.ceil(totalSales / limit) || 1}</span>
        <button disabled={currentPage >= Math.ceil(totalSales / limit)} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 bg-white border rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-50">Next</button>
      </div>
    </div>
  );
};

export default SalesHistoryCards;