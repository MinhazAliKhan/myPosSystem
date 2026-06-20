import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import saleApi from "../../api/sale.service";
import { toast } from "react-hot-toast";

const SaleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Invoice_${id}`,
  });

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaleDetails();
  }, [id]);

  const fetchSaleDetails = async () => {
    try {
      setLoading(true);
      const response = await saleApi.getSaleById(id);
      setSale(response.data.data);
    } catch (err) {
      toast.error("Failed to load details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading details...</div>;
  if (!sale) return null;

  return (
    <div className="p-6 flex flex-col items-center min-h-screen">
      {/* ব্যাক বাটন উপরে */}
      <div className="w-full max-w-4xl mb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="text-sm font-bold text-slate-500 hover:text-slate-800 transition-all"
        >
          ← Back to History
        </button>
      </div>

      {/* প্রিন্টযোগ্য কন্টেন্ট কার্ড (সেন্টারড) */}
      <div ref={componentRef} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full max-w-4xl">
        <div className="flex justify-between items-start mb-8 border-b pb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Invoice #{sale._id.slice(-6).toUpperCase()}</h2>
            <p className="text-slate-500 text-sm mt-1">Date: {new Date(sale.createdAt).toLocaleString()}</p>
            <p className="text-slate-500 text-sm">Cashier: {sale.createdBy?.userName || "Admin"}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
            sale.status === 'voided' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
          }`}>
            {sale.status}
          </span>
        </div>

        <div className="py-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 text-xs uppercase border-b">
                <th className="py-2">Product Name</th>
                <th className="py-2 text-right">Qty</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-50">
                  <td className="py-4 text-slate-700 font-medium">{item.name}</td>
                  <td className="py-4 text-right">{item.quantity} {item.unit}</td>
                  <td className="py-4 text-right text-slate-600">${item.price.toFixed(2)}</td>
                  <td className="py-4 text-right font-bold text-slate-800">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-xs text-right">
            <p className="text-slate-500 text-sm">Grand Total</p>
            <p className="text-2xl font-bold text-slate-800">${sale.totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* প্রিন্ট বাটন কার্ডের নিচে */}
      <div className="mt-8 w-full max-w-4xl flex justify-center no-print">
        <button 
          onClick={() => handlePrint()} 
          className="bg-blue-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          Print / Save PDF
        </button>
      </div>
    </div>
  );
};

export default SaleDetails;