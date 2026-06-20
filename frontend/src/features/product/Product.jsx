import React, { useState, useEffect } from "react";
import saleApi from "../../api/sale.service";
import { toast } from "react-hot-toast";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // ফিল্টার ও প্যাগিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchSales();
  }, [currentPage, searchTerm]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = { 
        page: currentPage, 
        limit, 
        search: searchTerm 
      };
      const response = await saleApi.getSales(params);
      // রেসপন্স স্ট্রাকচার অনুযায়ী ডাটা সেট করা
      setSales(response.data.data || []);
      setTotalSales(response.data.total || 0);
    } catch (err) {
      toast.error("Failed to load sales history");
    } finally {
      setLoading(false);
    }
  };

  const handleVoid = async (id) => {
    const reason = window.prompt("Enter reason for voiding this sale:");
    if (!reason) return;
    try {
      await saleApi.voidSale(id, { reason });
      toast.success("Sale voided successfully");
      fetchSales();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-6">Sales History ({totalSales})</h2>

      {/* সার্চ ও ফিল্টার বার */}
      <div className="bg-white p-4 rounded shadow mb-6 flex items-center gap-3">
        <input 
          type="text" 
          placeholder="Search by Invoice ID or Product..." 
          className="p-2 border rounded outline-none w-full md:w-1/3" 
          value={searchTerm} 
          onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} 
        />
      </div>

      {loading ? (
        <p className="text-center py-10">Loading Sales...</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="p-4">Invoice ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale) => (
                  <tr key={sale._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">{sale.invoiceId}</td>
                    <td className="p-4">${sale.totalAmount?.toFixed(2)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${sale.status === 'voided' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {sale.status !== 'voided' && (
                        <button 
                          onClick={() => handleVoid(sale._id)} 
                          className="text-red-500 hover:text-red-700 text-sm font-bold"
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

          {/* প্যাগিনেশন */}
          <div className="flex justify-center mt-6 gap-4 items-center">
            <button 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(p => p - 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50"
            >Prev</button>
            <span className="text-sm font-medium">Page {currentPage} of {Math.ceil(totalSales / limit) || 1}</span>
            <button 
              disabled={currentPage >= Math.ceil(totalSales / limit)} 
              onClick={() => setCurrentPage(p => p + 1)} 
              className="px-4 py-1 border rounded disabled:opacity-50"
            >Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default SalesHistory;