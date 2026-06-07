import React, { useState, useEffect, useRef } from "react";
import saleApi from "../../api/sale.service";
import { toast } from "react-hot-toast";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaBan, FaSync, FaPrint, FaTimes, FaEye } from "react-icons/fa";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSales, setTotalSales] = useState(0);
  const [startDate, setStartDate] = useState(""); 
  const [selectedSale, setSelectedSale] = useState(null);
  const limit = 10;
  
  const printRef = useRef();

  useEffect(() => {
    fetchMySales();
  }, [currentPage, startDate]);

  const fetchMySales = async () => {
    try {
      setLoading(true);
      const res = await saleApi.getSales({ page: currentPage, limit, startDate });
      setSales(res.data.data || []);
      setTotalSales(res.data.total || 0);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Browser-based Print Function (No library needed)
  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Invoice - POS</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px dashed #ccc; padding: 10px; text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .total-section { margin-top: 20px; text-align: right; font-weight: bold; font-size: 1.2em; }
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Refresh to restore React state
  };

  const handleVoid = async (e, id) => {
    e.stopPropagation();
    const reason = window.prompt("Enter reason for voiding:");
    if (!reason) return;
    try {
      await saleApi.voidSale(id, reason);
      toast.success("Transaction Voided");
      fetchMySales();
    } catch (err) {
      toast.error("Action Failed");
    }
  };

  const totalPages = Math.ceil(totalSales / limit) || 1;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] w-full bg-[#f8fafc] overflow-hidden">
      
      {/* 1. TOP HEADER */}
      <div className="bg-white p-5 border-b flex justify-between items-center shrink-0 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight">SALES LOG</h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Global Transaction Records</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input 
              type="date" 
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            />
          </div>
          {startDate && (
            <button onClick={() => {setStartDate(""); setCurrentPage(1);}} className="p-2.5 bg-slate-100 text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
              <FaSync size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN TABLE AREA */}
      <div className="flex-grow overflow-y-auto p-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <th className="pb-3 pl-6 text-left">Time & Order ID</th>
                <th className="pb-3 text-center">Amount ($)</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-300 font-bold animate-pulse">SYNCHRONIZING...</td></tr>
              ) : sales.map((sale) => (
                <tr 
                  key={sale._id} 
                  onClick={() => setSelectedSale(sale)}
                  className="bg-white group cursor-pointer hover:shadow-md hover:ring-1 hover:ring-blue-500/20 transition-all rounded-2xl"
                >
                  <td className="py-4 pl-6 rounded-l-2xl border-y border-l border-slate-100">
                    <div className="font-black text-slate-800 text-[13px]">
                        {new Date(sale.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                      #{sale._id.slice(-6).toUpperCase()} • {sale.items?.length} Items
                    </div>
                  </td>
                  <td className="py-4 text-center border-y border-slate-100 font-black text-slate-800 text-sm">
                    ${sale.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-4 text-center border-y border-slate-100">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest border ${
                      sale.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {sale.status?.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 pr-6 text-right rounded-r-2xl border-y border-r border-slate-100">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><FaEye size={11}/></button>
                      {sale.status === 'completed' && (
                        <button 
                          onClick={(e) => handleVoid(e, sale._id)}
                          className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                        >
                          <FaBan size={11} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PAGINATION FOOTER */}
      <div className="p-4 bg-white border-t flex justify-between items-center shrink-0 px-10 shadow-sm">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</p>
        <div className="flex gap-4">
          <button 
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(p => p - 1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
          >
            <FaChevronLeft size={10} /> PREV
          </button>
          <button 
            disabled={currentPage >= totalPages || loading}
            onClick={() => setCurrentPage(p => p + 1)}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[11px] font-black hover:bg-blue-600 shadow-lg shadow-blue-200 disabled:opacity-30 transition-all"
          >
            NEXT <FaChevronRight size={10} />
          </button>
        </div>
      </div>

      {/* 4. DETAIL MODAL & PRINT VIEW */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 text-xs tracking-widest uppercase">Invoice Details</h3>
              <button onClick={() => setSelectedSale(null)} className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-400"><FaTimes/></button>
            </div>
            
            {/* Printable Content Start */}
            <div ref={printRef} className="p-10 overflow-y-auto flex-grow bg-white">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tighter text-slate-900">SALE INVOICE</h2>
                <div className="mt-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                    Transaction ID: {selectedSale._id}<br/>
                    {new Date(selectedSale.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="border-y border-dashed border-slate-200 py-6 mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-400 text-left uppercase tracking-wider">
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3 text-center">Qty</th>
                      <th className="pb-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs font-bold text-slate-700">
                    {selectedSale.items?.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2">
                           <div className="text-slate-800 font-black">
                               {/* Item Name Fix: Checking multiple possible paths */}
                               {item.name || item.productName || item.product?.name || "Product Name Missing"}
                           </div>
                           <div className="text-[9px] text-slate-400 font-bold uppercase">${item.price} per unit</div>
                        </td>
                        <td className="py-2 text-center text-slate-500 font-black">{item.quantity}</td>
                        <td className="py-2 text-right text-slate-900 font-black">
                            ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                    <span>Subtotal</span>
                    <span>${selectedSale.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-black text-slate-900 pt-4 border-t border-slate-100 mt-4">
                  <span className="tracking-tighter">GRAND TOTAL</span>
                  <span className="text-blue-600">${selectedSale.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-12 text-center opacity-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Verified POS Transaction</p>
              </div>
            </div>
            {/* Printable Content End */}

            <div className="p-6 bg-slate-50 border-t flex gap-4">
              <button 
                onClick={handlePrint}
                className="flex-grow flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
              >
                <FaPrint/> PRINT RECEIPT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesHistory;