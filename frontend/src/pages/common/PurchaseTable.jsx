import React, { useState, useEffect } from "react";
import purchaseApi from "../../api/purchase.api";

const PurchaseTable = ({ refresh }) => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    purchaseApi.getAllPurchases().then(res => {
      setPurchases(res.data.data.purchases || []);
      setLoading(false);
    });
  }, [refresh]);

  if (loading) return <div className="p-10 text-center">Loading Purchases...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Supplier</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Product</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Qty/Price</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Total</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {purchases.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 text-sm font-medium">{p.supplier?.name}</td>
              <td className="p-4 text-sm">{p.product?.name}</td>
              <td className="p-4 text-sm">{p.quantity} x ${p.buyingPrice}</td>
              <td className="p-4 text-sm font-bold text-indigo-600 font-mono">${p.totalAmount}</td>
              <td className="p-4">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.status === 'Received' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PurchaseTable;